const express = require('express');
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator');

const router = express.Router();

//Middleware
const auth = require('../../middleware/auth');

//Models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route POST api/posts
//@desc Add a new post
//@access Private
router.post(
    '/',
    [
        auth,
        [
            check('text', 'Please add text to the post.')
            .not()
            .isEmpty()
        ]
    ],
    async (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            let user = await User.findById(req.user.id).select('-password');

            let newPost = new Post({
                user: user.id,
                name: user.name,
                avatar: user.avatar,
                text: req.body.text
            });

            await newPost.save();
            res.json(newPost);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error.');
        }
    }
);

//@route GET api/posts/
//@desc Get all posts
//@access Private
router.get('/', auth, async (req, res) => {
    try {
        let posts = await Post.find().sort({
            date: -1
        });

        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
});

//@route GET api/posts/:post_id
//@desc Get a post by post:id
//@access Private
router.get('/:post_id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);

        if (!post)
            return res.status(404).json({
                msg: 'Post is not found.'
            });

        res.json(post);
    } catch (error) {
        console.error(errror.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Post is not found.'
            });
        }

        res.status(500).send('Server error.');
    }
});

//@route DELETE api/posts/:post_id
//@desc Delete a post of an authorized user by post:id
//@access Private
router.delete('/:post_id', auth, async (req, res) => {
    try {
        let postToDelete = await Post.findById(req.params.post_id);

        //Check if post exists
        if (!postToDelete)
            return res.status(404).json({
                msg: 'Post is not found.'
            });

        //Check if user is authorized to delete the post
        if (postToDelete.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'Unauthorized action.'
            });
        }

        await postToDelete.remove();
        res.json({
            msg: 'Post is removed.'
        });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({
                msg: 'Post is not found.'
            });
        res.status(500).send('Server error.');
    }
});

//@route PUT api/posts/like/:post_id
//@desc Like a post as an authorized user
//@access Private
router.put('/like/:post_id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);

        //Check if post has been liked
        if (
            post.likes.filter(like => like.user.toString() === req.user.id).length > 0
        )
            return res.status(400).json({
                msg: 'Post has already been liked.'
            });

        post.likes.unshift({
            user: req.user.id
        });
        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
});

//@route PUT api/posts/unlike/:post_id
//@desc Unlike a post as an authorized user
//@access Private
router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);

        //Check if post has been liked
        if (
            post.likes.filter(like => like.user.toString() === req.user.id).length ==
            0
        )
            return res.status(400).json({
                msg: 'Post has not been liked.'
            });

        //Unlike process
        let removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
});

//@route POST api/posts/comment/:post_id
//@desc Add a comment to a post
//@access Private
router.post('/comment/:post_id', [auth,
    [
        check('text', 'Please add something.').not().isEmpty(),
    ]
], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        let user = await User.findById(req.user.id).select("-password");
        let post = await Post.findById(req.params.post_id);

        //Create new comment
        let newComment = {
            user: user.id,
            name: user.name,
            avatar: user.avatar,
            text: req.body.text
        };

        post.comments.unshift(newComment);
        await post.save();

        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
})

//@route DELETE api/posts/comment/:post_id/:comment_id
//@desc Delete comment of a post
//@access Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        //-----------------------------Brad way-------------------------------------------------------------------    
        //Find post
        let post = await Post.findById(req.params.post_id);

        //Pull out the comment
        let comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //Check if comment exists
        if (!comment) {
            return res.status(404).json({
                msg: "Comment is not found."
            });
        }

        //Check if user is authorized to delete the comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: "User is not authorized to delete the comment."
            });
        }

        //Delete proccess
        let removeIndex = post.comments.indexOf(comment);
        post.comments.splice(removeIndex, 1);
        await post.save();

        res.json(post.comments);

        //-----------------------------My way---------------------------------------------------------------------
        // //find post
        // let post = await Post.findById(req.params.post_id);

        // //check if comment or post exists
        // if (post.comments.filter(comment => (comment.id.toString() === req.params.comment_id)).length === 0) {
        //     return res.status(404).json({
        //         msg: "Comment or Post is not found."
        //     });
        // }

        // //Check if user authorized to delete comment
        // let removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        // if (removeIndex < 0) {
        //     return res.status(401).json({
        //         msg: "User is not authorized to delete the comment."
        //     });
        // }

        // //delete proccess
        // post.comments.splice(removeIndex, 1);
        // await post.save();

        // res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        //if Post_id is undefined
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Post is not found.'
            });
        }
        res.status(500).send('Server error.');
    }
});


module.exports = router;