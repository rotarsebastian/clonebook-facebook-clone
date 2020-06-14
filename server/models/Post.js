const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Comment = require(__dirname + '/Comment');

const PostSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
    },
    comments: {
        type: Array,
    },
    imgs: {
        type: Array,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;