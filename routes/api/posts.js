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
})

module.exports = router;