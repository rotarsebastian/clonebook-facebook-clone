const mongoose = require('mongoose');

const KeySchema = new mongoose.Schema({
    activate_or_reset_pass_key: {
        type: String,
        required: true
    },
    reset_pass_time: {
        type: String
    },
    user_id: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Key = mongoose.model('Key', KeySchema);

module.exports = Key;