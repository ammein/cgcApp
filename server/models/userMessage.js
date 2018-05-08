const {ObjectId,MongoClient} = require('mongodb');
const mongoose = require('mongoose');

var userMessageschema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    userAnswers : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    }},
    {
        timestamps : true
    });

var UserMessage = mongoose.model('UserMessage', userMessageschema);


module.exports = {
    UserMessage
}