"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const posts = [
    { id: 1, user_id: 1, post: 'kj khdskhf lkjl fjdskfjl ' },
    { id: 2, user_id: 1, post: 'df dfrc vega xcb  ' },
    { id: 3, user_id: 2, post: 'hello form any thing ' },
    { id: 4, user_id: 2, post: 'im user number2' },
    { id: 5, user_id: 2, post: 'kkj iek cjjadsfj kdc ' },
    { id: 6, user_id: 3, post: 'thankds for that fve ' },
    { id: 7, user_id: 4, post: 'please dont forget to do lalala ' },
];
const tokens = [
    { userId: 1, token: '434344' },
    { userId: 2, token: '55365' },
    { userId: 4, token: '44324655' },
];
const users = [
    { id: 1, user: 'khalid', pass: '123' },
    { id: 2, user: 'ali', pass: '345' },
    { id: 3, user: 'ahmed', pass: '678' },
    { id: 4, user: 'abdo', pass: '890' },
];
// /////Get login endpoint
router.post('/', (req, res) => {
    const userDB = users.filter(user => req.body.user === user.user && req.body.pass === user.pass);
    if (userDB.length === 1) {
        tokens.forEach(token => {
            if (token.userId === userDB[0].id) {
                res.json({ token: token.token });
            }
        });
    }
    else {
        res.json({ error: 'user name or pass are not correct or something went wrong' });
    }
    console.log(userDB.length, userDB);
    // res.json({key: 'login'});
});
router.get('/', (req, res) => {
    var _a;
    let id;
    const inToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Beare ')[1];
    console.log(inToken);
    tokens.forEach(token => {
        if (token.token === inToken) {
            id = token.userId;
        }
    });
    if (id) {
        const userPost = posts.filter(post => post.user_id === id);
        res.json(userPost);
    }
    else {
        res.json({ error: 'something went wrong' });
    }
});
module.exports = router;
