const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('dotenv').config({
    silent: true
});
// process.env.MONGO_HOST + "/test"
// 'mongodb://localhost:27017/QuestionApp'
mongoose.connect('mongodb://127.0.0.1:27017/QuestionApp');

module.exports = {
    mongoose
};