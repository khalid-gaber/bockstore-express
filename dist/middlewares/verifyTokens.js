"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const decodeTokenIfAny = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.token) {
            const decoded = yield jwt.verify(req.headers.token, process.env.JWT_KEY);
            req.user = decoded;
        }
        next();
    }
    catch (err) {
        next();
    }
});
module.exports = {
    decodeToken,
    decodeTokenIfAny
};
