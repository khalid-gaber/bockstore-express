import mongoose, { Schema } from 'mongoose';

const Token = mongoose.model('Token', new Schema({
    _id: {
        type: String,
        unique: true,
        index: true
    },
    userId: String
}))

module.exports = Token;