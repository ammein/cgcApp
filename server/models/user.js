const {ObjectId , MongoClient} = require('mongodb');
const mongoose = require('mongoose');

var userschema = new mongoose.Schema({
    from : {type : String,required: true , unique : true},
    level : {
        type : [Number]
    },
    answers : {
        type : [Boolean]
    }
},
{
    timestamps : true
});

var User = mongoose.model('User' , userschema);


module.exports = {
    User
}