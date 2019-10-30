const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('auth-token');

    //Check if not token
    if (!token) {
        res.status(401).json({
            msg: 'No token. Authorization is denied.'
        });
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtKey'));
        req.user = decoded.user; //put the decoded user in the req object

        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({
            msg: 'Token is not valid.'
        });
    }
}