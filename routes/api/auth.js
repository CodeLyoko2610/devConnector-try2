const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
//middleware
const auth = require('../../middleware/auth');

//models
const User = require('../../models/User');

//@route GET api/auth
//@desc Get authorized'us user info
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    //Search in the db for the user with same id, output the user from db, leaving out the password
    let user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error.');
  }
});

//@route POST api/auth
//@desc Login user
//@access Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error(errors.message);
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        let { email, password } = req.body;

        //See if the user is in database
        let userInDB = await User.findOne({ email: email });

        if (!userInDB) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid credentials.' }] }); //avoid naming the real error to prevent security holes
        }

        //Check if password matches
        let isMatch = await bcrypt.compare(password, userInDB.password);

        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid credentials.' }] }); //same reason above
        }

        //Return jsonwebtoken
        let payload = {
          user: {
            id: userInDB.id,
            name: userInDB.name,
            email: userInDB.email
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
