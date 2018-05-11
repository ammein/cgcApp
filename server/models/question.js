var mongoose = require('mongoose');
var MongoClient = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
// Pagination Module
var mongoosePaginate = require('mongoose-paginate');


function arrayLimit(val) {
    val.length <= 4;
};

var questionSchema = new mongoose.Schema({
    questionString : {
        type : String,
        required : true,
        date : Date.now,
        minlength : 3
    },
    answers : { 
        type : [Number],
        required: [true, 'There is no question without an answer. Please provide answers atleast 2 to that question'],        
        validate : {
            validator : function (val) {
                return val.length <= 4 && !(val.length === 0);
            },
            message : 'Answers = {VALUE} \n The answers are only limit between (0 < answers <= 4)'
        }
    },
    time : {
        type : Number,
        default : 60
    },
    level : {
        type : Number,
        default : 1
    }
});

questionSchema.plugin(mongoosePaginate);

var Question = mongoose.model('Question' , questionSchema);

module.exports = {
    Question
};