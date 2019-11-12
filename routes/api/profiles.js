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
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    //Collect info from request's body
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
    //Social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    //Build the profile
    try {
        let profile = await Profile.findOne({ user: req.user.id });

        //If profile exists, update
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )

            return res.json(profile);
        }
        //If not, create new one
        profile = new Profile(profileFields);

        //Save at the end
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
});

//@route GET api/profiles
//@desc Getting all profiles
//@access Public
router.get('/', async (req, res) => {
    try {
        let profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
});

//@route GET api/profiles/:user_id
//@desc Getting 1 user's profile by user_id
//@access Public
router.get('/:user_id', async (req, res) => {
    try {

        let profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        //Check if profile exists
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found.' })
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found.' }); //in case of malformed/invalid user_id, the response is still the same
        }
        res.status(500).send('Server error.');
    }
});

//@route DELETE api/profiles/
//@desc Delete a user, his profile and posts
//@access Private
router.delete('/', auth, async (req, res) => {
    try {
        //Delete user
        await User.findOneAndDelete({ _id: req.user.id });
        //Delete Profile
        await Profile.findOneAndDelete({ user: req.user.id });
        //@Todo~~~ Delete posts

        res.json({ msg: 'User deleted.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
});

//@route PUT api/profiles/experience
//@desc Add experience to an authorized user's profile
//@access Private
router.put('/experience', [auth, [
    check('title', 'Please insert a title.').not().isEmpty(),
    check('company', 'Please insert a company\'s name').not().isEmpty(),
    check('from', "Please enter the date you start working in this place.").not().isEmpty(),
]], async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    let {
        title,
        company,
        location,
        from,
        to,
        current,
        discription
    } = req.body;

    let newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        discription
    };

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newExp); //put the new element on top of the other elements

        profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
});

//@route DELETE api/profiles/experience/:exp_id
//@desc Delete an experience from user profile
//@access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });

        let removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error.');
    }
});


module.exports = router;