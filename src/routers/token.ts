import { Request, Response } from "express";
const express = require('express');
const router = express.Router();
const { decodeTokenIfAny } = require('../middlewares/verifyTokens');

router.post('/', decodeTokenIfAny, async (req: Request, res: Response)=>{
    if(req.user){
        res.status(201).json({user: req.user});
    } else {
        res.status(400);
    }
})

module.exports = router;
