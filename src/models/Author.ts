import { model, Schema, Model, Document } from 'mongoose';

const Author = model('Author', new Schema({
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
}, { timestamps: true }))

module.exports = Author;