import {  Request, Response } from "express";
const express = require('express');
const User = require('../models/User');
const {decodeToken} = require('../middlewares/verifyTokens');

const router = express.Router();

router.use(decodeToken);

router.put('/:id', async (req: Request, res: Response)=>{
    try {
        const {email, username} = req.body;
        if(req.user?._id === req.params.id){
            const newUser = await User.updateOne({_id: req.params.id}, {email, username, new: true})
            res.status(201).json({newUser, message: 'updated successfully'});
        } else {
            res.status(400).json({message: "you haven't the permision to do this operation"});
        }
    } catch(err: any) {
        res.status(400).json({message: err.message});
    }
})

router.delete('/:id', async (req: Request, res: Response)=>{
    try {
        if(req.user?._id === req.params.id){
            const user = await User.deleteOne({_id: req.params.id})
            res.status(201).json({message: 'deleted successfully'});
        } else {
            res.status(400).json({message: "you haven't the permision to do this operation"});
        }
    } catch(err: any) {
        res.status(400).json({message: err.message});
    }
})

module.exports = router;