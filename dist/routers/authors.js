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
const Author = require('../models/Author');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authors = yield Author.find({});
        res.status(200).json(authors);
    }
    catch (err) {
        console.log(err.message);
        res.status(404).json({ message: err.message });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = yield Author.find({ _id: `${req.params.id}` }, { firstName: 1, lastName: 1, nat: 1, image: 1 });
        if (!author) {
            throw new Error('this author not found');
        }
        res.status(200).json(author);
    }
    catch (err) {
        console.log(err.message);
        res.status(404).json({ message: err.message });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let author = yield Author.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nat: req.body.nat,
            image: req.body.image
        });
        res.json({
            data: author,
            message: 'the new author created successfully'
        });
    }
    catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = yield Author.updateOne({ _id: `${req.params.id}` }, { $set: req.body });
        console.log(author);
        res.status(201).json({ message: 'updated successfully' });
    }
    catch (err) {
        console.log(err.message);
        res.status(404).json({ message: err.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = yield Author.deleteOne({ _id: `${req.params.id}` });
        console.log(author);
        res.status(201).json({ message: 'deleted successfully' });
    }
    catch (err) {
        console.log(err.message);
        res.status(404).json({ message: err.message });
    }
}));
module.exports = router;
