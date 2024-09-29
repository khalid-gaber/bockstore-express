"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const Like = (0, mongoose_2.model)('Like', new mongoose_2.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'Post'
    }
}, { timestamps: true }));
module.exports = Like;
