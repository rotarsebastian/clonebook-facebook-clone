const Conversation = require(__dirname + '/../models/Conversation');
const User = require(__dirname + '/../models/User');

const saveMessageIntoDB = async(from, to, text) => {
    await Conversation.findOneAndUpdate(
        { $or: [ { user1: from, user2: to }, { user1: to, user2: from } ] }, 
        { user1: from, user2: to, $push: { messages: { from, text, date: new Date() } } }, 
        { upsert: true, useFindAndModify: false }
    );
}

const createMessageNotification = async(message, _id) => {
    const exists = await User.findOne({ _id, messages: { $elemMatch: { from: message.from }}});

    const messageNotif = exists ? { 
        'messages.$.from': message.from, 
        'messages.$.text': message.text, 
        'messages.$.from_user_first_name': message.from_user_first_name, 
        'messages.$.from_user_image': message.from_user_image, 
        'messages.$.date': message.date,  
        'messages.$.seen': false,  
    } 
    :
    {
        'from': message.from, 
        'text': message.text, 
        'from_user_first_name': message.from_user_first_name, 
        'from_user_image': message.from_user_image, 
        'date': message.date,  
        'seen': false,  
    };

    const searchQuery = exists ? { _id, messages: { $elemMatch: { from: message.from }}} : { _id };
    const updateQuery = exists ? { $set: messageNotif  } : { $addToSet: { messages: messageNotif }, $sort: { date: -1 } };

    await User.findOneAndUpdate(
        searchQuery,
        updateQuery, 
        { useFindAndModify: false });
}

module.exports = { 
    saveMessageIntoDB,
    createMessageNotification
}