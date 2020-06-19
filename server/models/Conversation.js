const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    },
    messages: {
        type: Array,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;