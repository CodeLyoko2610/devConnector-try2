const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');

//models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

//middleware
const auth = require('../../middleware/auth');

//@route GET api/profiles/me
//@desc Get current user profile
//@access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile for this user.'
            });
        }

        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})

//@route POST api/profiles
//@desc Create / Update a authorized user's profile
//@access Private
router.post('/', [
    auth,
    check('status', 'Status must be provided.').not().isEmpty(),
    check('skills', 'Please add your skills.').not().isEmpty()
], async (req, res) => {
    try {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        //Build a new profile
        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram
        } = req.body;

        let profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;
        //Skill field
        if (skills) {
            profileFields.skills = skills.split(",").map(skill => skill.trim());


        }

        console.log(profileFields.skills);
        console.log(skills);


        res.send('Creating profile ...');

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
})

module.exports = router;