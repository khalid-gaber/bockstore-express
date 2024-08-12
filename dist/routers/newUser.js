"use strict";
// import { Request, Response } from "express";
// const router = require('express').Router();
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const { authenticateToken } = require('../middlewares/verifyTokens');
// router.get('/user', authenticateToken, async (req: Request, res: Response ) => {
//     try {
//         if(req.decoded) {
//             const user = await User.findById(req.decoded.userId, {pass: 0, isAdmin: 0})
//             res.json({data: user});
//         } else {
//             res.sendStatus(403);
//         }
//     } catch (err: any) {
//         console.log(err.message);
//         res.sendStatus(403);
//     }
// })
// module.exports = router;
