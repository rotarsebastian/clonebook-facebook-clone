const Conversation = require(__dirname + '/../models/Conversation');

const saveMessageIntoDB = async(from, to, text) => {
    await Conversation.findOneAndUpdate(
        { $or: [ { user1: from, user2: to }, { user1: to, user2: from } ] }, 
        { user1: from, user2: to, $push: { messages: { from, text, date: new Date() } } }, 
        { upsert: true, useFindAndModify: false }
    );
}

module.exports = { 
    saveMessageIntoDB
}