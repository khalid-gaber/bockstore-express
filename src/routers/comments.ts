import { Request, Response } from "express";
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/verifyTokens');
const Comment = require('../models/Comment');
const Post = require('../models/Post')
const { postAfterCommentChange } = require('../utility/functionUtilities');

router.post('/', authenticateToken, async (req: Request, res: Response)=>{
    try {
        const comment = await Comment.create({
            user: req.decoded?.userId,
            post: req.body.postId,
            content: req.body.content
        })
        await Post.updateOne(
        {_id: req.body.postId}, 
        { $push: { comments: comment._id } },
        ).lean();
        const post = await postAfterCommentChange(req.body.postId, req.decoded?.userId);
        res.status(200).json({ data: post });
    } catch(err: any) {
        console.log(err.message);
        res.status(401).json({message: err.message || "something went wrong with your comment"})
    }
})

router.put('/', authenticateToken, async (req: Request, res: Response)=>{
    try {
        await Comment.findOneAndUpdate(
            {
                user: req.decoded?.userId,
                _id: req.body.commentId,
            },
            { $set: { content: req.body.content } },
        ).lean()
        const comment = await Comment.findOne({_id: req.body.commentId}).lean();
        res.status(200).json({ comment });
    } catch(err: any) {
        console.log(err.message);
        res.status(401).json({message: err.message || "something went wrong with your comment"})
    }
})

router.delete('/', authenticateToken, async (req: Request, res: Response)=>{
    try {
        console.log(req.decoded?.userId, req.body.commentId)
        const comment = await Comment.findOneAndDelete({
            user: req.decoded?.userId,
            _id: req.body.commentId,
        });
        console.log(comment);
        await Post.updateOne(
            {_id: comment.post}, 
            { $pull: { comments: req.body.commentId } },
        ).lean();
        const post = await postAfterCommentChange(comment.post, req.decoded?.userId);
        res.status(200).json({ data: post });
    } catch(err: any) {
        res.status(401).json({message: err.message || "something went wrong with your comment"})
    }
})

module.exports =  router;