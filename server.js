const {MongoClient} = require('mongo-db');
const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Question} = require('./db/question/question');
var env = process.env.NODE_ENV || 'development'; // Only in Heroku
var app = express();
app.use(bodyParser.json());

// Deploy Setting
// if(env === 'development'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/QuestionApp';
// }else if(env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/QuestionAppTest';
// }

var port = process.env.PORT || 3000;

// POST Question & Answers
app.post('/question' , (req , res)=>{
    var newQuestion = new Question({
        questionString: req.body.questionString,
        answers: [req.body.answers[0], req.body.answers[1], req.body.answers[2], req.body.answers[3]],
        time : req.body.time
    });

    newQuestion.save().then((question)=>{
        res.send(question)
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/question' , (req , res)=>{
    Question.find().then((question)=>{
        res.send({question});
    }, (err)=>{
        res.status(400).send(err);
    });
});

app.listen(port , ()=>{
    console.log(`Listen on port ${port}`);
});