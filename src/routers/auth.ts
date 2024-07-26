import { Request, Response } from "express";
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const {username, pass, email} = req.body
        const user = await User.find({username: username});
        if(user.length) {
            res.status(400).json({message: 'this user is already exist'});
        } else if(pass.length < 6) {
            res.status(400).json({message: 'password should be at least 6 characters'});
        } else {
            const hash = await bcrypt.hash(pass, 10)
            const newUser = await User.create({username, pass: hash, email});
            const token = jwt.sign({_id: newUser._id, username: newUser.username}, process.env.JWT_KEY);
            res.status(201).json({...newUser._doc, pass: null, token});
    }
    } catch (err: any) {
        if (err.message){
            res.status(400).json({message: err.message});
        } else {
            res.status(400).json({message: 'something went wrong with register route from server'});
        }
    }
})

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { pass, email} = req.body
        const user = await User.findOne({email: email});
        if(!user) {
            res.status(400).json({message: 'invalid email or password'});
        } else {
            const isAuth = await bcrypt.compare(pass, user.pass);
            if(!isAuth) {
                res.status(400).json({message: 'invalid email or password'});
            } else if(isAuth) {
                const token = jwt.sign({_id: user._id, username: user.username}, process.env.JWT_KEY);
                res.status(201).json({...user._doc, pass: null, token});
            }
        }
    } catch (err: any) {
        if (err.message){
            res.status(400).json({message: err.message});
        } else {
            res.status(400).json({message: 'something went wrong with login route from server'});
        }
    }
})


module.exports =  router;