"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const users = [
    { user: 'khalid', pass: '123' }
];
// /////Get Register endpoint
router.post('/', (req, res) => {
    const isExist = users.some((user) => user.user === req.body.user);
    if (isExist) {
        res.json({ error: 'user is already exist' });
    }
    else {
        users.push(req.body);
        res.json({ user: req.body.user });
    }
    console.log(users);
});
module.exports = router;
