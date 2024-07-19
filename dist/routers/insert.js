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
        // await Book.insertMany();
        const books = yield Book.find({});
        res.send('good');
        console.log(books);
    }
    catch (err) {
        console.log(err.message);
        res.send('bad');
    }
}));
module.exports = router;
