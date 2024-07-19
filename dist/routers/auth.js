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
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, pass, email } = req.body;
        const user = yield User.find({ username: username });
        if (user.length) {
            res.status(400).json({ message: 'this user is already exist' });
        }
        else {
            const hash = yield bcrypt.hash(pass, 10);
            const newUser = yield User.create({ username, pass: hash, email });
            const token = jwt.sign({ _id: newUser._id, username: newUser.username }, process.env.JWT_KEY);
            res.status(201).json(Object.assign(Object.assign({}, newUser._doc), { pass: null, token }));
        }
    }
    catch (err) {
        res.status(200).json({ message: err.message });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
                const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_KEY);
                res.status(201).json(Object.assign(Object.assign({}, user._doc), { pass: null, token }));
            }
        }
    }
    catch (err) {
        res.status(200).json({ message: err.message });
    }
}));
module.exports = router;
