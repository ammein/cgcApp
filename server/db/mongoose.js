const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// process.env.MONGO_HOST + "/api"
// 'mongodb://localhost:27017/QuestionApp'
mongoose.connect('mongodb://127.0.0.1:27017/test');

module.exports = {
    mongoose
};