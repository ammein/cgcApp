const {ObjectId , MongoClient} = require('mongodb');
const mongoose = require('mongoose');

var userschema = new mongoose.Schema({
    from : {
        type : String,
        required: true
    },
    level : {
        type : [Number]
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