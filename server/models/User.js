const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    friends: {
        type: Array,
    },
    requests: {
        type: Array,
    },
    images: {
        type: Array,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;