"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const decodeToken = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const decodeTokenIfAny = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_KEY);
        req.user = decoded || null;
        next();
    }
    catch (err) {
        next();
    }
};
module.exports = {
    decodeToken,
    decodeTokenIfAny
};
