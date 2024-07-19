"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const Book = (0, mongoose_2.model)('Book', new mongoose_2.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    author: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    des: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        min: 0
    },
    image: {
        type: String,
        default: 'default.jpeg',
        trim: true
    },
    cover: {
        type: String,
        enum: ['soft cover', 'hard cover']
    }
}));
module.exports = Book;
