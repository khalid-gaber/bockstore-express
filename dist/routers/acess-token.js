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
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const { createAccessToken } = require('../utility/utilities');
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = yield Token.findById(req.cookies.refreshToken);
        if (refreshToken._id) {
            jwt.verify(refreshToken._id, process.env.REFRESH_JWT_KEY, function (err, decoded) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(err.message || 'something went wrong');
                        yield Token.findByIdAndDelete(req.body.refreshToken);
                        res.cookie('refreshToken', '', { maxAge: -1 }); //////////////////////////////
                        res.sendStatus(402);
                    }
                    if (decoded) {
                        const accessToken = createAccessToken(decoded.userId);
                        res.status(201).json({ accessToken });
                    }
                });
            });
        }
        else {
            res.sendStatus(403);
        }
    }
    catch (err) {
        console.log(err.message || 'something went wrong');
        res.sendStatus(403);
    }
}));
module.exports = router;
