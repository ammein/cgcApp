const mongoose = require('mongoose');
require('dotenv').config({
    silent: true
});
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/QuestionApp' || process.env.MONGO_HOST + '/QuestionApp');

module.exports = {
    mongoose
};