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
const { authenticateToken } = require('../middlewares/verifyTokens');
const router = express.Router();
router.post('/', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.decoded) {
            const user = yield User.findById(req.decoded.userId, { pass: 0, isAdmin: 0 });
            res.json({ data: user });
        }
        else {
            res.sendStatus(403);
        }
    }
    catch (err) {
        console.log(err.message);
        res.sendStatus(403);
    }
}));
router.put('/', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.decoded) {
            const result = yield User.updateOne({ _id: req.decoded.userId }, { $set: {
                    username: req.body.username,
                    email: req.body.email,
                    phone: req.body.phone,
                    country: req.body.country,
                    gender: req.body.gender,
                }
            });
            res.sendStatus(201);
        }
        else {
            res.sendStatus(403);
        }
    }
    catch (err) {
        console.log(err.message);
        res.sendStatus(403);
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, username } = req.body;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === req.params.id) {
            const newUser = yield User.updateOne({ _id: req.params.id }, { email, username, new: true });
            res.status(201).json({ newUser, message: 'updated successfully' });
        }
        else {
            res.status(400).json({ message: "you haven't the permision to do this operation" });
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// router.delete('/:id', async (req: Request, res: Response)=>{
//     try {
//         if(req.user?._id === req.params.id){
//             const user = await User.deleteOne({_id: req.params.id})
//             res.status(201).json({message: 'deleted successfully'});
//         } else {
//             res.status(400).json({message: "you haven't the permision to do this operation"});
//         }
//     } catch(err: any) {
//         res.status(400).json({message: err.message});
//     }
// })
module.exports = router;
