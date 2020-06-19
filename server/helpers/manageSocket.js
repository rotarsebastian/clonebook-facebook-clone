const io = require(__dirname + '/../server').io;
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = socket => {
					
	console.log('SOCKET CONNECTED');

    // ====================== CHECK IF AUTHORIZED ======================
    socket.on('checkToken', (tokenObj) => {
        const { token } = tokenObj;

        if(token === null) return socket.emit('authorization', { status: 0, msg: 'Missing token!' });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return socket.emit('authorization', { status: 0, msg: 'User not authorized!', err });
            socket.emit('authorization', { status: 1 });
        });
    });
}