require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { DB_URL } = require(path.join(__dirname, 'config', 'keys.js'));
const routes = require(__dirname + '/routes/routes'); 
const mongoose = require('mongoose');
const socketio = require('socket.io');
const manageSocket = require(path.join(__dirname, 'helpers', 'manageSocket.js'));

const clientEndpoint = 'http://localhost:5000';

// ====================== GLOBAL VARIABLES ======================
global.db = '';

// ====================== DB CONNECTION ======================
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// ====================== MIDDLEWARE ======================
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json

// ====================== CORS HEADERS ======================
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', clientEndpoint);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// ====================== ADD ROUTES ======================
app.use('/api', routes);

// ====================== SERVER ======================
const PORT = process.env.PORT || 9999;
const server = app.listen(PORT, err => err ? console.log('Server ERROR...') : console.log('Server listening on port: ' + PORT));

// ====================== INIT SOCKET ======================
const io = module.exports.io = socketio(server);

// ====================== SOCKET ======================
io.on('connection', manageSocket);