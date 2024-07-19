"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Author = (0, mongoose_1.model)('Author', new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    nat: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    Image: {
        type: String,
        default: 'default-image.png',
        minLength: 1,
        maxLength: 200
    }
}, { timestamps: true }));
module.exports = Author;
