const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//import modules
const User = require('../../models/User');

//@route POST api/users
//@desc Register new user
//@access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with min length of 6 characters').isLength({ min: 6 }),

], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        res.send('users route');
    }
})

module.exports = router;