const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//import modules
const User = require('../../models/User');

//@route POST api/users
//@desc Register new user
//@access Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with min length of 6 characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        let { name, email, password } = req.body;

        //See if the user exists
        let user = await User.findOne({ email: email });

        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }
        //Get user gravatar
        const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });

        //Create a new user's instance - not save to db yet
        user = new User({
          name,
          email,
          avatar,
          password
        });

        //Encrypt password
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //Save user
        await user.save();

        //Return jsonwebtoken
        let payload = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        };

        jwt.sign(
          payload,
          config.get('jwtKey'),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (error) {
        console.error(error.message);
        res.status(500).send(`Server error`);
      }
    }
  }
);

module.exports = router;
