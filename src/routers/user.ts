import {  Request, Response } from "express";
const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middlewares/verifyTokens');

const router = express.Router();

router.post('/', authenticateToken, async (req: Request, res: Response ) => {
    try {
        if(req.decoded) {
            const user = await User.findById(req.decoded.userId, {pass: 0, isAdmin: 0})
            res.json({data: user});
        } else {
            res.sendStatus(403);
        }
    } catch (err: any) {
        console.log(err.message);
        res.sendStatus(403);
    }
})

// router.put('/:id', async (req: Request, res: Response)=>{
//     try {
//         const {email, username} = req.body;
//         if(req.user?._id === req.params.id){
//             const newUser = await User.updateOne({_id: req.params.id}, {email, username, new: true})
//             res.status(201).json({newUser, message: 'updated successfully'});
//         } else {
//             res.status(400).json({message: "you haven't the permision to do this operation"});
//         }
//     } catch(err: any) {
//         res.status(400).json({message: err.message});
//     }
// })

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