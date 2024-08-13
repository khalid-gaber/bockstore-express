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
const router = require('express').Router();
const User = require('../models/User');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const { createAccessToken, createRefreshToken } = require('../utility/functionUtilities');
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, pass, phone, country, gender, birthDate } = req.body;
        console.log('from register endpoint', phone, country, gender, birthDate);
        const user = yield User.find({ username: username });
        if (user.length) {
            res.status(400).json({ message: 'this user is already exist' });
        }
        else if (pass.length < 6) {
            res.status(400).json({ message: 'password should be at least 6 characters' });
        }
        else {
            const hash = yield bcrypt.hash(pass, 10);
            const newUser = yield User.create({ username, email, pass: hash, phone, country, gender, birthDate });
            const refreshToken = createRefreshToken(newUser._id);
            const accessToken = createAccessToken(newUser._id);
            yield Token.create({ _id: refreshToken, userId: newUser._id });
            res.cookie('refreshToken', refreshToken, { maxAge: 60000 * 60 * 24 * 365 * 10, httpOnly: true, sameSite: 'strict' });
            res.status(201).json({ accessToken });
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message || 'something went wrong with register route from server' });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.cookies);
        const { pass, email } = req.body;
        const user = yield User.findOne({ email: email });
        if (!user) {
            res.status(400).json({ message: 'invalid email or password' });
        }
        else {
            const isAuth = yield bcrypt.compare(pass, user.pass);
            if (!isAuth) {
                res.status(400).json({ message: 'invalid email or password' });
            }
            else if (isAuth) {
                const refreshToken = createRefreshToken(user._id);
                const accessToken = createAccessToken(user._id);
                yield Token.create({ _id: refreshToken, userId: user._id });
                res.cookie('refreshToken', refreshToken, { maxAge: 60000 * 60 * 24 * 365 * 10 });
                res.json({ accessToken });
            }
        }
    }
    catch (err) {
        if (err.message) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'something went wrong with login route from server' });
        }
    }
}));
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        yield Token.findByIdAndDelete(refreshToken);
        res.cookie('refreshToken', refreshToken, { maxAge: -1 });
        res.sendStatus(203);
    }
    catch (err) {
        console.log(err.message || 'something went wrong');
        res.sendStatus(404);
    }
}));
module.exports = router;
