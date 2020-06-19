// ====================== IMPORTS ======================
const router = require('express').Router();
const { isAuthenticated } = require(__dirname + '/../../helpers/auth');
const Conversation = require(__dirname + '/../../models/Conversation');
const User = require(__dirname + '/../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

global.globalConversations = 0;
global.touchedConversation = null;

// ====================== WATCH USER friendRequests ======================
router.get('/subscribe', async(req, res) => {
    try {
        let localConversations = 0;
        res.set('Content-Type', 'text/event-stream');
        res.set('Connection', 'Keep-alive');
        res.set('Cache-Control', 'no-cache');

        setInterval(async() => {
            if(localConversations === globalConversations) return res.status(200).write('data: 0' + '\n\n');
            else if(localConversations < globalConversations) {
                let changedRequest = null;

                changedRequest = { ...touchedConversation};  

                // setTimeout(() => {
                //     touchedConversation = null;
                // }, 2000);

                localConversations = globalConversations;
                return res.status(200).write(`data: ${JSON.stringify(changedRequest)}`  + '\n\n');
            }
        }, 1000);
 
    } catch (err) {
        return res.json({ status: 0, message: 'Error getting friendRequests!'});
    }
});

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

module.exports = router;
