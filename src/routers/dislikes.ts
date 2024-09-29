import { Request, Response } from "express";
const express = require('express');
const router = express.Router();
const Post = require('../models/Post')
const { authenticateToken } = require('../middlewares/verifyTokens');
const { addDislike, deleteDislike, getInteractedPost } = require('../utility/functionUtilities');

// POST => {url}/api/dislikes
router.post('/', authenticateToken, async (req: Request, res: Response)=>{
    try {
        //add dislike after deleting like(if any) then return the new post
        await addDislike(req.decoded?.userId, req.body.postId);
        const post = await getInteractedPost(req.decoded?.userId || '', req.body.postId);

        res.status(201).json({ data: post });
    } catch(err: any) {
        console.log(err.message);
        res.status(401).json({message: err.message || "something went wrong with your comment"})
    }
})

// DELETE => {url}/api/dislikes
router.delete('/', authenticateToken, async (req: Request, res: Response)=>{
    try {
        //delete dislike
        await deleteDislike(req.decoded?.userId, req.body.postId);
        
        const post = await getInteractedPost(req.decoded?.userId || '', req.body.postId);
        res.status(201).json({ data: post });
    } catch(err: any) {
        console.log(err.message);
        res.status(401).json({message: err.message || "something went wrong with your comment"})
    }
})

module.exports =  router;