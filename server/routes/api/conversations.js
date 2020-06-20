// ====================== IMPORTS ======================
const router = require('express').Router();
const { isAuthenticated } = require(__dirname + '/../../helpers/auth');
const Conversation = require(__dirname + '/../../models/Conversation');
const User = require(__dirname + '/../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

// ====================== GET CONVERSATION ======================
router.get('/:id', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE USER IDS ======================
        const { _id } = req.user;
        const { id } = req.params;
        if(!_id || !id) return res.json({ status: 0, message: 'Missing ids!', code: 404 });

        // ====================== GET THE OFFSET ======================
        const { offset } = req.query;
        if(!offset) return res.json({ status: 0, message: 'Invalid request'});

        // ====================== CONSTRUCT SKIP AND LIMIT ======================
        let limit;
        if(parseInt(offset) === 0) limit = -20;
        else limit = [ parseInt(offset) * -1, 20 ];

        // ====================== GET CONVERSATION ======================
        const conversation = await Conversation.findOne(
            { $or: [ { user1: id, user2: _id }, { user1: _id, user2: id } ] },
            { messages: { $slice: limit } }
        );

        // ====================== EVERYTHING OK ======================s
        return res.json({ status: 1, message: 'Conversation retrieved successfully!', data: conversation });

    } catch (err) {
        return res.json({ status: 0, message: 'Error getting conversation!'});
    }
});

// ====================== GET MESSAGES NOTIFICATIONS ======================
router.get('/', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE USER ID ======================
        const { _id } = req.user;
        if(!_id) return res.json({ status: 0, message: 'Missing id!', code: 404 });


        // ====================== GET THE OFFSET ======================
        const { offset } = req.query;
        if(!offset) return res.json({ status: 0, message: 'Invalid request'});

        if(!Number.isInteger(Number(offset))) return res.json({ status: 0, message: 'Offset should be a number', code: 404 });

        // ====================== GET MESSAGES NOTIFICATIONS ======================
        const user_requests = await User.find(_id).select('messages -_id').sort('date');

        // ====================== EVERYTHING OK ======================s
        return res.json({ status: 1, message: 'Messages notifs retrieved successfully!', data: user_requests });

    } catch (err) {
        return res.json({ status: 0, message: 'Error getting messages notifs!'});
    }
});

// ====================== UPDATE NEW MESSAGES ======================
router.patch('/:id', isAuthenticated, async(req,res) => {
    try {
        // ====================== GET THE USER IDS ======================
        const { _id } = req.user;
        const { id } = req.params;
        if(!_id || !id) return res.json({ status: 0, message: 'Missing ids!', code: 404 });

        // ====================== GET CONVERSATION ======================
        await User.findOneAndUpdate({ _id, messages: { $elemMatch: { from: id }}},
            { $set: { 'messages.$.seen': true } }, 
            { useFindAndModify: false });

        // ====================== EVERYTHING OK ======================s
        return res.json({ status: 1, message: 'Conversation seen successfully!' });

    } catch (err) {
        return res.json({ status: 0, message: 'Error marking conversation as seen!'});
    }
});

module.exports = router;
