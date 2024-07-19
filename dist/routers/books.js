"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let currentPage = 1;
        let limit = 20;
        if (req.query.current_page && +req.query.current_page > 0) {
            currentPage = +req.query.current_page;
        }
        if (req.query.limit && +req.query.limit > 0 && +req.query.limit <= 20) {
            limit = +req.query.limit;
        }
        const books = yield Book.find({}).skip((currentPage - 1) * limit).limit(limit).populate('author', { firstName: 1, lastName: 1 });
        const meta = {
            current_page: currentPage,
            limit,
            isMore: books.length === limit
        };
        res.status(200).json({ meta, data: books });
    }
    catch (err) {
        res.status(200).json({ message: err.message });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book.findById(req.params.id).populate('author');
        if (!book) {
            throw new Error('this book not found');
        }
        res.status(200).json(book);
    }
    catch (err) {
        res.status(200).json({ message: err.message });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new Error('please enter book data');
        }
        const { title, author, des, price, cover } = req.body;
        const newBook = yield Book.create({ title, des, author, price, cover });
        res.status(201).json({
            data: newBook,
            message: 'you entered the book successfully'
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(404).json({ message: err.message });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book.updateOne({ _id: req.params.id }, { $set: req.body });
        res.status(201).json({
            data: book,
            message: 'updating book'
        });
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book.deleteOne({ _id: req.params.id });
        res.status(201).json({
            data: book,
            message: 'book has been deleted successfully'
        });
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}));
module.exports = router;
