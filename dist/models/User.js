"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User = (0, mongoose_1.model)('User', new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
        unique: true
    },
    pass: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 50,
        unique: true
    },
    phone: {
        type: String,
        minLength: 5,
        maxLength: 15
    },
    country: {
        type: String,
        minLength: 3,
        maxLength: 20
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    birthDate: {
        type: Date,
    },
    avatar: {
        type: String,
        minLength: 3,
        maxLength: 255,
        default: function () {
            return `${this.gender}-avatar.png`;
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}));
module.exports = User;
