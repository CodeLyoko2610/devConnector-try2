const express = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator');

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
        res.status(400).json({ errors: errors.array() });
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

//@route GET api/posts/:post_id
//@desc Get a post by post:id
//@access Private
router.get('/:post_id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);

        if (!post) return res.send(404).json({ msg: 'Post is not found.' });

        res.json(post);
    } catch (error) {
        console.error(errror.message);
        if (error.kind === 'ObjectId') {
            return res.send(404).json({ msg: 'Post is not found.' });
        }

        res.status(500).send('Server error.');
    }
});

module.exports = router;