const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// process.env.MONGO_HOST + "/api"
// 'mongodb://localhost:27017/QuestionApp'
mongoose.connect('mongodb://210.195.147.148:27017/test');

module.exports = {
    mongoose
};