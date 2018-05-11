var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

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

userschema.plugin(mongoosePaginate);
var User = mongoose.model('User', userschema);

module.exports = User;