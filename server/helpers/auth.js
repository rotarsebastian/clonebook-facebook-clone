require('dotenv').config();
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token === null) return res.json({ status: 0, msg: 'Missing token!'});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.json({ status: 0, msg: 'User not authorized!'});
        req.user = user;
        next();
    });
}

const generateAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); 
}

module.exports = { 
    isAuthenticated,
    generateAccessToken
}