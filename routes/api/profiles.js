const express = require('express');
const router = express.Router();

//@route GET api/profiles
//@desc TEST route
//@access Public
router.get('/', (req, res) => {
    res.send('profiles route');
})

module.exports = router;