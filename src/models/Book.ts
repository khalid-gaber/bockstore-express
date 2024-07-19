import mongoose from 'mongoose';
import { model, Schema, Model, Document, ObjectId } from 'mongoose';

const Book = model('Book', new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    author: {
        type: mongoose.Types.ObjectId,
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
}))

module.exports = Book;


  