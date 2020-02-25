/* eslint-disable indent */
const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = function (req, res, next) {
    const token = req.header('x-auth');
    if (!token) return res.status(401).send('Acess denided.No token provided.');

    try {
        const decoded = jwt.verify(token, 'jwtuserkey');
        //const decoded = jwt.verify(token, 'jwtPrivateKey');
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

