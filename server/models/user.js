const {ObjectId , MongoClient} = require('mongodb');
const mongoose = require('mongoose');

var userschema = new mongoose.Schema({
    from : {
        type : String,
        required: true
    },
    text : {
        type : String,
        required : false
    },
    level : {
        type : [Number],
        required : true
    },
    answers : {
        type : [Boolean],
        required : true
    }
});


var User = mongoose.model('User' , userschema);


module.exports = {
    User
}