const mongoose = require('mongoose');

const Refresh_Token_Schema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    }
});

const Refresh_Token = mongoose.model('Refresh_Token', Refresh_Token_Schema);

module.exports = Refresh_Token;