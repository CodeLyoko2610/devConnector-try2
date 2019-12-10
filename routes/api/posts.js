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
router.post('/', [auth, [
    check('text', 'Please add text to the post.').not().isEmpty(),
]], async (req, res) => {
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
});

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

        if (!post) return res.status(404).json({
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
        if (!postToDelete) return res.status(404).json({
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
        if (error.kind === 'ObjectId') return res.status(404).json({
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
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) return res.status(400).json({
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
})

//@route PUT api/posts/unlike/:post_id
//@desc Unlike a post as an authorized user
//@access Private
router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);

        //Check if post has been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length == 0) return res.status(400).json({
            msg: "Post has not been liked."
        });

        //Unlike process
        let removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
})

module.exports = router;