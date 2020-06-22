const mongoose = require('mongoose');

// ====================== NOT USED NOW - CAN BE INTEGRATED FOR POSTS ======================
const CommentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    authorImg: {
        type: String
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
    },
    edited: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;