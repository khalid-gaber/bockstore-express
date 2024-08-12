"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
    var _a;
    try {
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
        console.log(accessToken);
        const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_KEY);
        if (decoded) {
            req.decoded = decoded;
            next();
        }
        else {
            res.sendStatus(403);
        }
    }
    catch (error) {
        res.sendStatus(403);
    }
}
///////export///////////
module.exports = {
    authenticateToken
};
