// ====================== IMPORTS ======================
require('dotenv').config();
const router = require('express').Router();
const User = require(__dirname + '/../../models/User');
const Key = require(__dirname + '/../../models/Key');
const Refresh_Token = require(__dirname + '/../../models/RefreshToken');
const { isAuthenticated, generateAccessToken } = require(__dirname + '/../../helpers/auth');
const { handleInitialFormCheck } = require(__dirname + '/../../helpers/requestCheck');
const { constructActivationEmail, constructForgotCredentialsEmail } = require(__dirname + '/../../helpers/mails');
const { editUser } = require(__dirname + '/../../helpers/dbqueries');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { uuid, isUuid } = require('uuidv4');
const nodemailer = require('nodemailer');
const moment = require('moment');
const xoauth2 = require('xoauth2');
const { gmail } = require(__dirname + '/../../config/gmailConfig');
const { clientEndpoint } = require(__dirname + '/../../config/otherConfigs');
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;

const client = process.env.CLIENT || clientEndpoint;

// ====================== SETUP MAILER ======================
const transportObject = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_SENDER || gmail.senderEmail,
        clientId: process.env.MAIL_CLIENT || gmail.client_id,
        clientSecret: process.env.MAIL_SECRET || gmail.client_secret,
        refreshToken: process.env.MAIL_REFRESH || gmail.refresh_token,
    }
}
let transporter = nodemailer.createTransport(transportObject);

// ====================== GET A SPECIFIC USER ======================
router.get('/loggedUser', isAuthenticated, async(req, res) => {
    try {
        // ====================== GET THE USER ID ======================
        const { _id } = req.user;
        if(!_id) return res.json({ status: 0, message: 'Missing id!', code: 404 });

        // ====================== GET THE USER ======================
        const user = await User.findById(_id);
        if(!user) return res.json({ status: 0, message: 'User does not exists!', code: 404 });
        
        // ====================== EVERYTHING OK ======================s
        return res.json({ status: 1, message: 'User retrieved successfully!', data: user });

    } catch (err) {
        return res.json({ status: 0, message: 'Error getting user!'});
    }
});

// ====================== GET A SPECIFIC USER ======================
router.get('/user/:id', isAuthenticated, async(req, res) => {

    try {
        // ====================== GET THE USER ID ======================
        const { id } = req.params;
        if(!id) return res.json({ status: 0, message: 'Missing id!', code: 404 });

        // ====================== GET THE USER ======================
        const user = await User.findById(id).select('-friends -posts -password -email');
        if(!user) return res.json({ status: 0, message: 'User does not exists!', code: 404 });
        
        // ====================== EVERYTHING OK ======================s
        return res.json({ status: 1, message: 'User retrieved successfully!', data: user });

    } catch (err) {
        return res.json({ status: 0, message: 'Error getting user!'});
    }
});

// ====================== DELETE A USER ======================
router.delete('/', isAuthenticated, async(req, res) => {
    try {
        const user = await User.query().deleteById(req.session.user.id);
        if (!user) return res.json({ status: 0, message: 'Error deleting the user!'});

        req.session.destroy(err => {
            if(err) return res.json({ status: 0, message: 'Error while trying to logout user!', code: 404 });
    
            // ====================== CLEAR USER COOKIE ======================
            res.clearCookie('user_sid');
    
            // ====================== EVERYTHING OK ======================
            return res.json({ status: 1, message: 'User deleted successfully!'});
        });

    } catch (err) {
        return res.json({ status: 0, message: 'Error deleting the user!'});
    }
});

// ====================== EDIT USER PROFILE ======================
router.patch('/', isAuthenticated, async(req, res) => {
    try {
        // ====================== HANDLE INITIAL CHECK ======================
        const initialCheckRes = handleInitialFormCheck(req.body, 'edit', 3);
        if(initialCheckRes.status !== 1) return res.json(initialCheckRes);

        // ====================== MAKE REQUEST TO EDIT USER PROFILE ======================
        const updateResult = await editUser([ ...req.body ], req.session.user.id);
        res.json(updateResult);
    } catch(err) {
        return res.json({ status: 0, msg: 'Error updating user profile!'});
    }
});

// ====================== LOGOUT ======================
router.delete('/logout', async(req,res) => {
    const token = req.body.token;
    if(!token) return res.json({ status: 0, msg: 'Missing token!'});

    const deletedToken = await Refresh_Token.deleteOne({ refreshToken: token });
    if(!deletedToken) return res.json({ status: 0, msg: 'Error deleting token!'});
    return res.json({ status: 1, msg: 'User logged out!'});
});

// ====================== CHECK IF USER HAS A SESSION ======================
router.get('/checkauth', isAuthenticated, async(req, res) => {
    try {
        // ====================== FIND LOGGED USER ======================
        const loggedUser = await User.query().select('id', 'email', 'first_name', 'last_name', 'birthdate', 'created_at').findById(req.session.user.id);
        if(!loggedUser) return res.json({ status: 0, msg: 'User not authorized!'});

        // ====================== SEND BACK LOGGED USER ======================
        return res.status(200).json({ status: 1, msg: 'User authorized!', user: loggedUser });
    
    // ====================== HANDLE ERROR ======================
    } catch(err) {
        return res.json({ status: 0, msg: 'User not authorized!'});
    }
});

// ====================== RESET USER PASSWORD ======================
router.post('/resetpass', async(req, res) => {

    // ====================== HANDLE INITIAL CHECK ======================
    const initialCheckRes = handleInitialFormCheck(req.body, 'resetpass', 3, 'resetpass');
    if(initialCheckRes.status !== 1) return res.json(initialCheckRes);

    // ====================== EXTRACT FORM ELEMENTS ======================
    const [ { val: password }, { val: repeatPassword }, { key: oldKey } ] = [ ...req.body ];

    // ====================== CHECK IF KEY IS THE RIGHT FORMAT ======================
    if(!isUuid(oldKey)) return res.json({ status: 0, message: 'Wrong key!', code: 155 });

    // ====================== CHECK IF PASSWORDS MATCH ======================
    if(password !== repeatPassword) return res.json({ status: 0, message: 'Passwords do not match!', code: 10 });
    
    // ====================== CHECK IF USER EXISTS ======================
    const foundKey = await Key.findOne({ activate_or_reset_pass_key: oldKey }).collation({ locale: 'en', strength: 2 });
    if(!foundKey) return res.json({ status: 0, message: 'Your link has expired!', code: 155 });
    if(foundKey.reset_pass_time === null) return res.json({ status: 0, message: 'Your link has expired!', code: 155 });

    // ====================== CHECK IF THE KEY IS STILL VALID ======================
    const timeNow = moment().unix(); // NOW
    const userLimitTime = moment(foundKey.reset_pass_time).unix(); // USER TIME TO EXPIRE
    const difference = Number(userLimitTime) - Number(timeNow); // DIFFERENCE FROM NOW TO USER TIME

    // ====================== IF DIFFERENCE IS NOT POSITIVE - TIME HAS EXPIRED ======================
    if(difference <= 0 ) return res.json({ status: 0, message: 'Your link has expired!', code: 155 });

    // ====================== ENCRYPT THE NEW PASSWORD ======================
    bcrypt.hash(password, saltRounds, async(err, hashedPassword) => {
        if(err) return res.json({ status: 0, message: 'Error while trying to encrypt user password!', code: 404 });
        try {
            // ====================== UPDATE USER PASSWORD IN THE DB ======================
            const dbResponse = await User.findOneAndUpdate({ _id: foundKey.user_id }, { password: hashedPassword  }, { upsert: true, useFindAndModify: false });
            if(!dbResponse) return res.json({ status: 0, message: 'Error while trying to update user password!', code: 404 });

            const keyUpdated = await Key.findOneAndUpdate({ user_id: foundKey.user_id }, { activate_or_reset_pass_key: uuid(), reset_pass_time: null }, { upsert: true, useFindAndModify: false });
            if(!keyUpdated) return res.json({ status: 0, message: 'Error while trying to update the key!', code: 404 });

            return res.status(200).json({ status: 1, message: 'Your password has been changed successfully!', code: 200 });

        // ====================== HANDLE ERROR ======================
        } catch(err) {
            return res.json({ status: 0, message: 'Error while trying to update user password!', code: 404 });
        }
    });
});

// ====================== RECOVER CREDENTIALS OR RESEND ACTIVATION EMAIL ======================
router.post('/recover', async(req, res) => {

    // ====================== HANDLE INITIAL CHECK ======================
    const initialCheckRes = handleInitialFormCheck(req.body, 'recover', 1);
    if(initialCheckRes.status !== 1) return res.json(initialCheckRes);

    // ====================== EXTRACT EMAIL ======================
    const [ { val: email } ] = [ ...req.body ];
    
    try {
        // ====================== CHECK IF USER EXISTS ======================
        const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
        if(!user) return res.json({ status: 0, message: 'Incorrect email!', code: 15 });

        // ====================== CHECK IF VERIFIED ======================
        const user_key = await Key.findOne({ user_id: user._id }).collation({ locale: 'en', strength: 2 });

        // ====================== RESEND CONFIRMATION EMAIL ======================
        if(user_key.verified === false) {
            const activateEmail = constructActivationEmail({ ...user._doc, activate_or_reset_pass_key: user_key.activate_or_reset_pass_key });
            transporter.sendMail(activateEmail, err => {
                if(err) return res.json({ status: 0, message: 'Error while trying to send email!', code: 404 });
                    else return res.status(200).json({ status: 1, message: 'Reactivation email was sent successfully!', user: user.email, code: 200 });
            });
        }

        // ====================== SEND CHANGE PASSWORD EMAIL ======================
        else { 
            // ====================== CREATE A NEW KEY TO RESET THE PASSWORD ======================
            const activate_or_reset_pass_key = uuid(); 
            const reset_pass_time = moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss').trim(); // GIVE IT 1 HOUR VALIDITY

            // ====================== PUT THE NEW KEY INTO THE DB ======================
            const profileUpdated  = await Key.findOneAndUpdate({ user_id: user._id }, { activate_or_reset_pass_key, reset_pass_time  }, { upsert: true, useFindAndModify: false });
            if(!profileUpdated) return res.json({ status: 0, message: 'Error updating key!', code: 404 });

            // ====================== SEND THE RESET PASSWORD EMAIL ======================
            const resetPassEmail = constructForgotCredentialsEmail(user, activate_or_reset_pass_key);
            transporter.sendMail(resetPassEmail, err => {
                if(err) return res.json({ status: 0, message: 'Error while trying to send email!', code: 404 });
                    else return res.status(200).json({ status: 1, message: 'An email to reset your password was sent to you!', code: 200 });    
            });
        }
    // ====================== HANDLE ERROR ======================
    } catch (err) {
        return res.json({ status: 0, message: 'Error while trying to recover user!', code: 404 });
    }
});

// ====================== CHECK IF RESET PASSWORD LINK IT IS NOT EXPIRED ======================
router.get('/reset', async(req, res) => {

    // ====================== GET THE KEY FROM THE QUERY STRING AND CHECK IT ======================
    const { key } = req.query;
    if(!key) return res.redirect(`${client}/login?expired=true`);
    if(!isUuid(key)) return res.redirect(`${client}/login?expired=true`);

    // ====================== FIND THE USER WITH THE SAME KEY ======================
    const foundKey = await Key.findOne({ activate_or_reset_pass_key: key }).collation({ locale: 'en', strength: 2 });
    if(!foundKey) return res.redirect(`${client}/login?expired=true`);
    if(foundKey.reset_pass_time === null) return res.redirect(`${client}/login?expired=true`);

    // ====================== CHECK IF THE KEY IS STILL VALID ======================
    const timeNow = moment().unix(); // NOW
    const userLimitTime = moment(foundKey.reset_pass_time).unix(); // USER TIME TO EXPIRE
    const difference = Number(userLimitTime) - Number(timeNow); // DIFFERENCE FROM NOW TO USER TIME

    // ====================== IF DIFFERENCE IS NOT POSITIVE - TIME HAS EXPIRED ======================
    if(difference <= 0 ) return res.redirect(`${client}/login?expired=true`);

    // ====================== DIFFERENCE IS POSITIVE - REDIRECT USER TO CHANGE PASSWORD ======================
    else return res.redirect(`${client}/login?key=${key}`);
});

// ====================== ACTIVATE ACCOUNT ======================
router.get('/activate', async(req, res) => {

    // ====================== GET THE KEY FROM THE QUERY STRING AND CHECK IT ======================
    const { key } = req.query;
    if(!key) return res.redirect(`${client}/login?expired=true`);
    if(!isUuid(key)) return res.redirect(`${client}/login?expired=true`);

    try {
        // ====================== FIND THE USER WITH THE SAME KEY ======================
        const user_key = await Key.findOne({ activate_or_reset_pass_key: key }).collation({ locale: 'en', strength: 2 });
        if(!user_key) return res.redirect(`${client}/login?expired=true`); // WRONG KEY OR ALREADY ACTIVATED

        // ====================== CHECK IF USER ALREADY ACTIVATED HIS ACCOUNT ======================
        if(user_key.verified === true) return res.redirect(`${client}/login?expired=true`); // ALREADY ACTIVATED

        // ====================== USER IS CORRECT - RESET KEY AND CHANGE IT TO VERIFIED ======================
        const activatedAccount  = await Key.findOneAndUpdate({ activate_or_reset_pass_key: key }, { verified: true }, { upsert: true, useFindAndModify: false });
        if(activatedAccount !== undefined) return res.redirect(`${client}/login?activated=${key}`);
            else return res.redirect(`${client}/login?expired=true`);

    } catch (err) {
        return res.redirect(`${client}/login?expired=true`);
    }
});

// ====================== LOGIN USER ======================
router.post('/login', async(req, res) => {

    // ====================== HANDLE INITIAL CHECK ======================
    const initialCheckRes = handleInitialFormCheck(req.body, 'login', 2);
    if(initialCheckRes.status !== 1) return res.json(initialCheckRes);

    // ====================== EXTRACT FORM ELEMENTS ======================
    const [ { val: email }, { val: password } ] = [ ...req.body ];
    
    try {
        // ====================== CHECK IF USER EXISTS ======================
        const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
        if(!user) return res.json({ status: 0, message: 'Incorrent email!', code: 15 });

        const user_key = await Key.findOne({ user_id: user._id }).collation({ locale: 'en', strength: 2 });
        if(user_key && user_key.verified === false) return res.json({ status: 0, message: 'Please activate your account first!', code: 17 });

        // ====================== CHECK IF USER PASSWORD IS CORRECT ======================
        bcrypt.compare(password, user.password, async(err, isSame) => {
            if (err) return res.json({ status: 0, message: 'Error while trying to compare passwords!', code: 404 });

            // ====================== PASSWORDS DO NOT MATCH ======================
            if(!isSame) return res.json({ status: 0, message: 'Incorrent password', code: 16 });

            // ====================== ALL OK - CREATING A SESSION FOR USER ======================
            else {
                const loggedUser = { 
                    _id: user._id, first_name: user._doc.first_name, last_name: user._doc.last_name
                };

                const accessToken =  generateAccessToken(loggedUser);
                const refreshToken = jwt.sign(loggedUser, process.env.REFRESH_TOKEN_SECRET);

                const refresh_token = await Refresh_Token.create({ refreshToken });
                if(!refresh_token) return res.json({ status: 0, message: 'Error while inserting refresh token!', code: 404 });
                
                return res.status(200).json({ status: 1, message: 'User logged in', accessToken, refreshToken, loggedUser, code: 200 });
            }
        });
    // ====================== HANDLE ERROR ======================
    } catch (err) {
        return res.json({ status: 0, message: 'Error while trying to login user!', code: 404 });
    }
});

// ====================== CREATE NEW TOKEN ======================
router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken === null) return res.json({ status: 0, message: 'Missing token!', code: 404 });

    const foundToken = await Refresh_Token.findOne({ refreshToken }).collation({ locale: 'en', strength: 2 });
    if(!foundToken) return res.json({ status: 0, message: 'Invalid refresh token!', code: 15 });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.json({ status: 0, msg: 'User not authorized!'});
        const accessToken = generateAccessToken({ _id: user._id });
        const { iat, ...userToSend } = user;
        return res.json({ accessToken, user: userToSend });
    });

}); 

// ====================== REGISTER USER ======================
router.post('/register', (req, res) => {

    // ====================== HANDLE INITIAL CHECK ======================
    const initialCheckRes = handleInitialFormCheck(req.body, 'register', 6);
    if(initialCheckRes.status !== 1) return res.json(initialCheckRes);

    // ====================== EXTRACT FORM ELEMENTS ======================
    const [ { val: first_name }, { val: last_name }, { val: birthdate }, { val: email }, { val: password }, { val: gender }] = [ ...req.body ];
    
    // ====================== ENCRYPT THE PASSWORD ======================
    bcrypt.hash(password, saltRounds, async(err, hashedPassword) => {
        if(err) return res.json({ status: 0, message: 'Error while trying to register user!', code: 404 });
        try {
            // ====================== HANDLE EXISTING EMAIL ======================
            const existingUser = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
            if(existingUser) return res.json({ status: 0, message: 'Email is already taken!', code: 2 }); 

            // ====================== INSERT THE NEW USER ======================
            const newUser = { 
                first_name, 
                last_name, 
                birthdate, 
                email, 
                password: hashedPassword, 
                gender,
            };

            const user = await User.create(newUser);
            if(!user) return res.json({ status: 0, message: 'Error while inserting user!', code: 404 });

            const activate_or_reset_pass_key = uuid();
            const key = await Key.create({ activate_or_reset_pass_key, user_id: user._id, verified: false });
            if(!key) return res.json({ status: 0, message: 'Error while inserting key!', code: 404 });

            // ====================== SEND ACTIVATION EMAIL ======================
            const activateEmail = constructActivationEmail({ ...newUser, activate_or_reset_pass_key });
            transporter.sendMail(activateEmail, err => {
                if(err) return res.json({ status: 0, message: 'Error while trying to send email!', code: 404 });
                    else return res.status(200).send({ status: 1, message: `SUCCESS: User ${newUser.email} - ${user._id} is now created!`, code: 200 });
            });
        // ====================== HANDLE ERROR ======================
        } catch(err) {
            return res.json({ status: 0, message: 'Error while trying to register user!', code: 404 });
        }
    });
        
});

module.exports = router;