import mongoose from 'mongoose';
import { model, Schema, Model, Document, ObjectId } from 'mongoose';

const User = model('User', new Schema({
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
    isAdmin: {
        type: Boolean,
        default: false
    }
}))

module.exports = User;


  