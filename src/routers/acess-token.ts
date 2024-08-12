import { Request, Response } from "express";
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const { createAccessToken } = require('../utility/functionUtilities');

router.post('/', async (req: Request, res: Response ) => {
    try {
        const refreshToken = await Token.findById(req.cookies.refreshToken);
        if (refreshToken._id) {
            jwt.verify(refreshToken._id, process.env.REFRESH_JWT_KEY, async function(err: any, decoded: any) {
                if(err) {
                    console.log(err.message || 'something went wrong');
                    await Token.findByIdAndDelete(req.body.refreshToken);
                    res.cookie('refreshToken', '', {maxAge: -1});//////////////////////////////
                    res.sendStatus(402);
                }
                if(decoded) {
                    const accessToken = createAccessToken(decoded.userId);
                    res.status(201).json({accessToken});
                }
            });
        } else {
            res.sendStatus(403);
        }
    } catch(err: any) {
        console.log(err.message||'something went wrong');
        res.sendStatus(403);
    }
})

module.exports = router;