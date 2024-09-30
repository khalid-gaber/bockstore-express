import mongoose from 'mongoose';
import { model, Schema, Model, Document, ObjectId } from 'mongoose';

const Dislike = model('Dislike', new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Post'
    }
},
{ timestamps: true }
))

module.exports = Dislike;
