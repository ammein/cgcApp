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
        type : [Number]
    },
    answers : {
        type : [Boolean]
    }
});

userschema.statics.findByUser = function(req,user){
    var User = this;

    return User.findOne({
        "_id" : user,
        "from" : req.body.from
    });
}


var User = mongoose.model('User' , userschema);


module.exports = {
    User
}