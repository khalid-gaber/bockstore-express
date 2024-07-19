import { Request, Response } from "express";
const express = require('express');
const router = express.Router();
const Book = require('../models/Book')

type Book = {
    id: number,
    title: string,
    author: string,
    des: string,
    price: number,
    cover: string
}

router.get('/', async (req: Request, res: Response) => {
    try {
        let currentPage = 1;
        let limit = 20;
        if(req.query.current_page && +req.query.current_page > 0){
            currentPage = +req.query.current_page;
        }
        if(req.query.limit && +req.query.limit > 0 && +req.query.limit <= 20){
            limit = +req.query.limit;
        }
        const books = await Book.find({}).skip((currentPage-1)*limit).limit(limit).populate('author', {firstName: 1, lastName: 1});
        const meta = {
            current_page: currentPage,
            limit,
            isMore: books.length === limit
        }
        res.status(200).json({meta, data: books});
    } catch (err: any) {
        res.status(200).json({message: err.message});
    }
})

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const book = await Book.findById(req.params.id).populate('author');
        if(!book){
            throw new Error('this book not found');
        }
        res.status(200).json(book);
    } catch (err: any) {
        res.status(200).json({message: err.message});
    }
})

router.post('/', async (req: Request, res: Response)=>{
    try {
        if(!req.body){
            throw new Error('please enter book data');
        }
        const {title, author, des, price, cover} = req.body;
        const newBook = await Book.create({title, des, author, price, cover})
        res.status(201).json({
            data: newBook,
            message: 'you entered the book successfully'
        });
    } catch(err: any) {
        console.log(err.message);
        res.status(404).json({message: err.message})
    }
})

router.put('/:id', async (req: Request, res: Response)=>{
    try {
        const book = await Book.updateOne({_id: req.params.id}, {$set: req.body});
        res.status(201).json({
            data: book,
            message: 'updating book'
        });
    } catch(err: any) {
        res.status(404).json({message: err.message})
    }
})

router.delete('/:id', async (req: Request, res: Response)=>{
    try {
        const book = await Book.deleteOne({_id: req.params.id});
        res.status(201).json({
            data: book,
            message: 'book has been deleted successfully'
        });
    } catch(err: any) {
        res.status(404).json({message: err.message})
    }
})

module.exports =  router;