require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const formidable = require('formidable');
const { DB_URL } = require(path.join(__dirname, 'config', 'keys.js'));
const routes = require(__dirname + '/routes/routes'); 
const mongoose = require('mongoose');
// const cors = require('cors');

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

app.post('/posts', (req,res) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        const userId = '5eb3d6c4a8f5795ba8946014';
        const text = fields.txtName;
        const collection = db.collection('users');
        const postID = new ObjectID();
        // Insert in the user with id 5eb3d6c4a8f5795ba8946014 in the posts array
        collection.findOneAndUpdate({ 
                _id: new ObjectID(userId) 
            }, { 
                $push: { posts: { _id: postID, text } } 
            }, (err, result) => err ? res.json(err) : res.json(postID)
        );
    });
});

app.post('/users', (req,res) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        // ====================== VALIDATE THE DATA ======================
        const firstName = fields.txtFirstName;
        const surname = fields.txtSurname;
        const email = fields.txtEmail;
        const password = fields.txtPassword;

        const birthday = `${fields.txtBirthDay}/${fields.txtBirthMonth}/${fields.birthYear}`;
        const gender = fields.txtGender;
        
        const collection = db.collection('users');
        collection.insertOne({ firstName, surname, email, password, birthday, gender, posts: [], friends: [] }, (err, dbRes) => {
            if(err) return console.log('Cannot insert new user!')
            res.status(200).json({ id: dbRes.insertedId });
        })

    });
});

// ====================== ADD ROUTES ======================
app.use('/api', routes);

// ====================== SERVER ======================
const PORT = process.env.PORT || 9999;
app.listen(PORT, err => err ? console.log('Server ERROR...') : console.log('Server listening on port: ' + PORT));