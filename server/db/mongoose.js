const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// process.env.MONGO_HOST + "/api"
// 'mongodb://localhost:27017/QuestionApp'
mongoose.connect(process.env.MONGO_HOST + "/api");

module.exports = {
    mongoose
};