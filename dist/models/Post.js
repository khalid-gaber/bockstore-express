"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const Post = (0, mongoose_2.model)('Post', new mongoose_2.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    comments: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Comment'
        }],
    categories: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Category'
        }],
    likes: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'User'
        }],
    dislikes: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'User'
        }]
}, { timestamps: true }));
module.exports = Post;
