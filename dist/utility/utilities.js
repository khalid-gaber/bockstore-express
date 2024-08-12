"use strict";
const jwt = require('jsonwebtoken');
function createRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.REFRESH_JWT_KEY, { expiresIn: '5m' });
}
function createAccessToken(userId) {
    return jwt.sign({ userId }, process.env.ACCESS_JWT_KEY, { expiresIn: '20s' });
}
module.exports = {
    createRefreshToken,
    createAccessToken
};
