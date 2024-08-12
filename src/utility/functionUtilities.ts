const jwt = require('jsonwebtoken');

function createRefreshToken(userId: string) {
    return jwt.sign({userId},process.env.REFRESH_JWT_KEY, {expiresIn: '7d'});
}

function createAccessToken(userId: string) {
    return jwt.sign({userId},process.env.ACCESS_JWT_KEY, {expiresIn: '15m'});
}

module.exports = {
    createRefreshToken,
    createAccessToken
}