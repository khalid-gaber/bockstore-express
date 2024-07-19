import { Request, Response } from "express";
const express = require('express');
const router = express.Router();
const Book = require('../models/Book')

router.get('/', async (req: Request, res: Response)=>{
    try{
        // await Book.insertMany();
        const books = await Book.find({});
        res.send('good')
        console.log(books);    
    } catch (err: any) {
        console.log(err.message);
        res.send('bad')
    }
})

module.exports = router;