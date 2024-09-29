"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
    var _a;
    try {
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
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
        console.log(error.message || 'something went wrong');
        res.sendStatus(403);
    }
}
function decodeTokenIfAny(req, res, next) {
    var _a;
    try {
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
        if (accessToken && accessToken !== 'null' && accessToken !== 'undefined') {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_KEY);
            if (decoded) {
                req.decoded = decoded;
                next();
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            next();
        }
    }
    catch (error) {
        console.log(error.message);
        next();
    }
}
///////export///////////
module.exports = {
    authenticateToken,
    decodeTokenIfAny
};
