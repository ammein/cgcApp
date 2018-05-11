const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('dotenv').config({
    silent: true
});

mongoose.connect(process.env.MONGO_HOST + "/QuestionApp" ||'mongodb://localhost:27017/QuestionApp');

module.exports = {
    mongoose
};