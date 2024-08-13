import { Request, Response } from "express";
const router = require('express').Router();
const User = require('../models/User');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const { createAccessToken, createRefreshToken } = require('../utility/functionUtilities');

router.post('/register', async (req: Request, res: Response) => {
    try {
        const {username, email, pass, phone, country, gender, birthDate} = req.body
        console.log('from register endpoint', phone, country, gender, birthDate)
        const user = await User.find({username: username});
        if(user.length) {
            res.status(400).json({message: 'this user is already exist'});
        } else if(pass.length < 6) {
            res.status(400).json({message: 'password should be at least 6 characters'});
        } else {
            const hash = await bcrypt.hash(pass, 10)
            const newUser = await User.create({username, email, pass: hash, phone, country, gender, birthDate});
            const refreshToken = createRefreshToken(newUser._id);
            const accessToken = createAccessToken(newUser._id);
            await Token.create({_id: refreshToken, userId: newUser._id});
            res.cookie('refreshToken', refreshToken, {maxAge: 60000*60*24*365*10, httpOnly: true, sameSite: 'strict'});
            res.status(201).json({accessToken});
        }
    } catch (err: any) {
        res.status(400).json({message: err.message || 'something went wrong with register route from server'});
    }
})

router.post('/login', async (req: Request, res: Response ) => {
    try {
        console.log(req.cookies);
        const { pass, email} = req.body
        const user = await User.findOne({email: email});
        if(!user) {
            res.status(400).json({message: 'invalid email or password'});
        } else {
            const isAuth = await bcrypt.compare(pass, user.pass);
            if(!isAuth) {
                res.status(400).json({message: 'invalid email or password'});
            } else if(isAuth) {
                const refreshToken = createRefreshToken(user._id);
                const accessToken = createAccessToken(user._id);
                await Token.create({_id: refreshToken, userId: user._id});
                res.cookie('refreshToken', refreshToken, {maxAge: 60000*60*24*365*10});
                res.json({accessToken});
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

router.post('/logout', async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        await Token.findByIdAndDelete(refreshToken);
        res.cookie('refreshToken', refreshToken, {maxAge: -1});
        res.sendStatus(203);
    } catch(err: any) {
        console.log(err.message||'something went wrong')
        res.sendStatus(404);
    }
})

module.exports = router;

