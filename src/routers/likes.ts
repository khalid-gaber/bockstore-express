import { Request, Response } from "express";
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/verifyTokens');
const { addLike, deleteLike, getInteractedPost } = require('../utility/functionUtilities');

// POST => {url}/api/likes
router.post('/', authenticateToken, async (req: Request, res: Response)=>{
    try {
        //add like after deleting dislike(if any) then return the new post
        await addLike(req.decoded?.userId, req.body.postId);
        const post = await getInteractedPost(req.decoded?.userId || '', req.body.postId);
        
        res.status(201).json({ data: post });
    } catch(err: any) {
        console.log(err.message);
        res.status(401).json({message: err.message || "something went wrong with your comment"})
    }
})

// DELETE => {url}/api/likes
router.delete('/', authenticateToken, async (req: Request, res: Response)=>{
    try {
        //delete like
        await deleteLike(req.decoded?.userId, req.body.postId);
        
        const post = await getInteractedPost(req.decoded?.userId || '', req.body.postId);
        res.status(201).json({ data: post });
    } catch(err: any) {
        console.log(err.message);
        res.status(401).json({message: err.message || "something went wrong with your comment"})
    }
})

module.exports =  router;