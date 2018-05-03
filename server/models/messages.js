const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: [{
        text: String,
        sendBy :{
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    }]
},
    {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    });

const Messages = mongoose.model('Message', MessageSchema);      

module.exports = {
    Messages
}