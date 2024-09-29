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
const { authenticateToken } = require('../middlewares/verifyTokens');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { postAfterCommentChange } = require('../utility/functionUtilities');
router.post('/', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const comment = yield Comment.create({
            user: (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.userId,
            post: req.body.postId,
            content: req.body.content
        });
        yield Post.updateOne({ _id: req.body.postId }, { $push: { comments: comment._id } }).lean();
        const post = yield postAfterCommentChange(req.body.postId, (_b = req.decoded) === null || _b === void 0 ? void 0 : _b.userId);
        res.status(200).json({ data: post });
    }
    catch (err) {
        console.log(err.message);
        res.status(401).json({ message: err.message || "something went wrong with your comment" });
    }
}));
router.put('/', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield Comment.findOneAndUpdate({
            user: (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.userId,
            _id: req.body.commentId,
        }, { $set: { content: req.body.content } }).lean();
        const comment = yield Comment.findOne({ _id: req.body.commentId }).lean();
        res.status(200).json({ comment });
    }
    catch (err) {
        console.log(err.message);
        res.status(401).json({ message: err.message || "something went wrong with your comment" });
    }
}));
router.delete('/', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        console.log((_a = req.decoded) === null || _a === void 0 ? void 0 : _a.userId, req.body.commentId);
        const comment = yield Comment.findOneAndDelete({
            user: (_b = req.decoded) === null || _b === void 0 ? void 0 : _b.userId,
            _id: req.body.commentId,
        });
        console.log(comment);
        yield Post.updateOne({ _id: comment.post }, { $pull: { comments: req.body.commentId } }).lean();
        const post = yield postAfterCommentChange(comment.post, (_c = req.decoded) === null || _c === void 0 ? void 0 : _c.userId);
        res.status(200).json({ data: post });
    }
    catch (err) {
        res.status(401).json({ message: err.message || "something went wrong with your comment" });
    }
}));
module.exports = router;
