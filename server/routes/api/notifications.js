// ====================== IMPORTS ======================
const router = require('express').Router();
const { isAuthenticated } = require(__dirname + '/../../helpers/auth');
const { handleInitialFormCheck } = require(__dirname + '/../../helpers/requestCheck');
const moment = require('moment');
const User = require(__dirname + '/../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

global.globalRequests = 0;
global.touchedRequest = null;

// ====================== WATCH USER friendRequests ======================
router.get('/subscribe', async(req, res) => {
    try {
        let localRequests = 0;
        res.set('Content-Type', 'text/event-stream');
        res.set('Connection', 'Keep-alive');
        res.set('Cache-Control', 'no-cache');

        setInterval(async() => {
            if(localRequests === globalRequests) return res.status(200).write('data: 0' + '\n\n');
            else if(localRequests < globalRequests) {
                let changedRequest = null;

                changedRequest = { ...touchedRequest};  

                // setTimeout(() => {
                //     touchedRequest = null;
                // }, 2000);

                localRequests = globalRequests;
                return res.status(200).write(`data: ${JSON.stringify(changedRequest)}`  + '\n\n');
            }
        }, 1000);
 
    } catch (err) {
        return res.json({ status: 0, message: 'Error getting friendRequests!'});
    }
});

// ====================== GET USER FRIEND REQUESTS ======================
router.get('/', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE USER ID ======================
        const { _id } = req.user;
        if(!_id) return res.json({ status: 0, message: 'Missing id!', code: 404 });


        // ====================== GET THE OFFSET ======================
        const { offset } = req.query;
        if(!offset) return res.json({ status: 0, message: 'Invalid request'});

        if(!Number.isInteger(Number(offset))) return res.json({ status: 0, message: 'Offset should be a number', code: 404 });

        // ====================== GET FRIEND REQUESTS ======================
        const user_requests = await User.findById(_id).select('requests -_id');

        // ====================== EVERYTHING OK ======================s
        return res.json({ status: 1, message: 'Requests retrieved successfully!', data: user_requests });

    } catch (err) {
        return res.json({ status: 0, message: 'Error getting requests!'});
    }
});

// ====================== CREATE FRIEND REQUEST NOTIFICATION ======================
router.get('/sendFriendRequest', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE USER FROM ID ======================
        const { _id } = req.user;
        if(!_id) return res.json({ status: 0, message: 'Missing from id!', code: 404 });

        // ====================== GET THE USER TO ID ======================
        const { id } = req.query;
        if(!id) return res.json({ status: 0, message: 'Missing to id!', code: 404 });

        // ====================== ADD FRIEND REQ ======================
        const userFrom = await User.findById(_id).select('first_name last_name images');
        const { _id: from, ...rest } = userFrom._doc;
        
        const newFriendSentReq = { _id: new ObjectId(), to: id, type: 'sentreq' };
        const newFriendReq = { _id: new ObjectId(), ...rest, from: _id, to: id, type: 'request' };

        await User.findOneAndUpdate({ _id }, { $addToSet: { requests: newFriendSentReq  } }, { upsert: true, useFindAndModify: false });
        await User.findOneAndUpdate({ _id: id }, { $addToSet: { requests: newFriendReq  } }, { upsert: true, useFindAndModify: false });
        
        touchedRequest = { ...newFriendReq, isNew: true };
        globalRequests++;

        // ====================== EVERYTHING OK ======================s
        return res.json({ status: 1, message: 'Friend request sent!' });

    } catch (err) {
        return res.json({ status: 0, message: 'Error creating notification!'});
    }
});

// ====================== ANSWER FRIEND REQUEST ======================
router.post('/answerFriendReq', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE USER FROM ID ======================
        const { _id } = req.user;
        if(!_id) return res.json({ status: 0, message: 'Missing from id!', code: 404 });

        // ====================== GET BODY ======================
        const { answer, ...rest } = req.body;

        const newFriend = { _id: new ObjectId(), friend_id: rest.from, name: `${rest.first_name} ${rest.last_name}`, image: rest.images[0] };
        const user = await User.findById(_id).select('first_name last_name images');
        
        const { _id: from, ...rest2 } = user._doc;
        const newFriendBack = { _id: new ObjectId(), friend_id: _id, name: `${rest2.first_name} ${rest2.last_name}`, image: rest2.images[0] };

        const acceptFriendReq = { _id: new ObjectId(), ...rest2, from: _id, to: rest.from, type: 'accept' };

        // ====================== REMOVE SENT REQUEST FROM SENDER ======================
        await User.findOneAndUpdate(
            { _id: rest.from }, 
            { 
                $pull: { requests: { to: _id, type: 'sentreq' } } 
            }, 
            { upsert: true, useFindAndModify: false }
        );

        // ====================== ADD FRIEND ======================
        if(answer === 1) {
            await User.findOneAndUpdate(
                { _id }, 
                {   
                    $addToSet: { friends: newFriend }, 
                    $pull: { requests: { _id: ObjectId(rest._id) } } 
                }, 
                { upsert: true, useFindAndModify: false }
            );
            await User.findOneAndUpdate(
                { _id: rest.from }, 
                { 
                    $addToSet: { friends: newFriendBack, requests: acceptFriendReq }
                }, 
                { upsert: true, useFindAndModify: false }
            );
            setTimeout(() => {
                touchedRequest = { ...acceptFriendReq, isNew: true };
                globalRequests++;
            }, 1500);
        } 
        
        // ====================== DELETE REQ ======================
        else {
            await User.findOneAndUpdate(
                { _id },
                { $pull: { requests: { _id: ObjectId(rest._id) } } },
                { upsert: true, useFindAndModify: false }
            );
        }
        
        touchedRequest = { deletedNotifId: rest._id.toString(), from: rest.to };
        globalRequests++;

        // ====================== EVERYTHING OK ======================s
        return res.json({ status: 1, message: 'Friend request answered!' });

    } catch (err) {
        return res.json({ status: 0, message: 'Error answering request!'});
    }
});

// ====================== DELETE NOTIFICATION ======================
router.post('/deleteNotification/:id', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE USER ID ======================
        const { _id } = req.user;
        if(!_id) return res.json({ status: 0, message: 'Missing from id!', code: 404 });

        // ====================== GET NOTIFICATION ID ======================
        const { id: notifID } = req.params;

        // ====================== DELETE REQ ======================
        await User.findOneAndUpdate({ _id }, { $pull: { requests: { _id: ObjectId(notifID) } } }, { upsert: true, useFindAndModify: false });
        
        touchedRequest = { deletedNotifId: notifID.toString() };
        globalRequests++;

        // ====================== EVERYTHING OK ======================s
        return res.json({ status: 1, message: 'Deleted notification!' });

    } catch (err) {
        return res.json({ status: 0, message: 'Error deleting notif!'});
    }
});

module.exports = router;
