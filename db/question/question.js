var mongoose = require('mongoose');
const {MongoClient , ObjectID} = require('mongo-db');

var questionSchema = new mongoose.Schema({
    questionString : {
        type : String,
        required : true,
        date : Date.now,
        minlength : 3
    },
    answers : [{
        type : Number,
        required : true,
        default : null
    }],
    time : {
        type : Number,
        required : true
    }
});

var Question = mongoose.model('Question' , questionSchema);

module.exports = {
    Question
};