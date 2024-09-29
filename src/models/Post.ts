import mongoose from 'mongoose';
import { model, Schema, Model, Document, ObjectId } from 'mongoose';

const Post = model('Post', new Schema({
    user: {
        type: mongoose.Types.ObjectId,
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
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }],
    categories: [{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    }],
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
},
{ timestamps: true }
))

module.exports = Post;
