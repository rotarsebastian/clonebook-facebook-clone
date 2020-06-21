// ====================== IMPORTS ======================
const router = require('express').Router();

// ====================== WATCH FRIENDS STATUSES ======================
router.get('/subscribe', async(req, res) => {
    try {
        res.set('Content-Type', 'text/event-stream');
        res.set('Connection', 'Keep-alive');
        res.set('Cache-Control', 'no-cache');

        setInterval(() => res.status(200).write(`data: ${JSON.stringify(currentlyConnectedUsers.map(user => user.userId))}||${JSON.stringify(disconnectedUsersTimes)}`  + '\n\n'), 1000);
 
    } catch (err) {
        return res.json({ status: 0, message: 'Error getting statuses!'});
    }
});

module.exports = router;
