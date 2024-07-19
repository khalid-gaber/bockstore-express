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
const router = express.Router();
const { decodeTokenIfAny } = require('../middlewares/verifyTokens');
router.post('/', decodeTokenIfAny, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        res.status(201).json({ user: req.user });
    }
    else {
        res.status(404).json({ message: 'token not found or invalid' });
    }
}));
module.exports = router;
