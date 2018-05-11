var MongoClient = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
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

module.exports = mongoose.model('User', userschema);
