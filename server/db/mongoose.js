const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// process.env.MONGO_HOST + "/api"
// 'mongodb://localhost:27017/QuestionApp'
mongoose.connect('mongodb://localhost:27017/QuestionApp');

module.exports = {
    mongoose
};