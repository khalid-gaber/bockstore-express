import mongoose from 'mongoose';
import { model, Schema, Model, Document, ObjectId } from 'mongoose';

const Comment = model('Comment', new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    post: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Post'
    }
},
{ timestamps: true }
))

module.exports = Comment;
