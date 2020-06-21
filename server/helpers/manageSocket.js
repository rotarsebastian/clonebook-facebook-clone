require('dotenv').config();
const jwt = require('jsonwebtoken');
const { saveMessageIntoDB, createMessageNotification } = require(__dirname + '/messages');
const User = require(__dirname + '/../models/User');

global.currentlyConnectedUsers = [];
global.disconnectedUsersTimes = [];

const getUserSocketId = userId => {
    const user = currentlyConnectedUsers.find(user => user.userId === userId);
    if(!user) return false;
    return user.socketId;
}

module.exports = socket => {
    const { io } = require(__dirname + '/../server');

    // ====================== CHECK IF AUTHORIZED ======================
    socket.on('checkToken', tokenObj => {
        const { token } = tokenObj;

        if(token === null) return socket.emit('authorization', { status: 0, msg: 'Missing token!' });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return socket.emit('authorization', { status: 0, msg: 'User not authorized!', err });
            currentlyConnectedUsers.push({ socketId: socket.id, userId: user._id });
            disconnectedUsersTimes = disconnectedUsersTimes.filter(user => user.id !== user._id);  

            socket.emit('authorization', { status: 1 });
        });
    });

    // ====================== SEND NEW MESSAGE ======================
    socket.on('sendMessage', data => {
        if(!data) return;
        const { from, to, text, from_user_first_name, from_user_image } = data;
        if(!from || !to || !text) return;

        const message = { from, text, from_user_first_name, from_user_image, date: new Date() };
        
        saveMessageIntoDB(from, to, text);
        createMessageNotification(message, to);

        const sendToSocketId = getUserSocketId(to);
        if(!sendToSocketId) return;

        io.to(sendToSocketId).emit('gotMessage', message);
    });

    // ====================== PERSON IS TYPING ======================
    socket.on('isTyping', data => {
        if(!data) return;
        const { from, to, typing } = data;
        if(!from || !to) return;

        const sendToSocketId = getUserSocketId(to);
        if(!sendToSocketId) return;

        io.to(sendToSocketId).emit('printIsTyping', { from, typing });
    });

    // ====================== USER DISCONECTED ======================
    socket.on('disconnect', async() => {
        const disconnectedUser = currentlyConnectedUsers.find(user => user.socketId === socket.id);
        currentlyConnectedUsers = currentlyConnectedUsers.filter(user => user.socketId !== socket.id);  
        if(disconnectedUser) disconnectedUsersTimes.push({ id: disconnectedUser.userId, time: new Date() });
    });
}