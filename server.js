var {MongoClient, ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} = require('./server/db/mongoose');
var {Question} = require('./server/models/question');
// var env = process.env.NODE_ENV || 'development'; // Only in Heroku
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
app.post('/question/api' , (req , res)=>{
    var newQuestion = new Question({
        questionString: req.body.questionString,
        answers: req.body.answers,
        time : req.body.time
    });

    newQuestion.save().then((question)=>{
        res.send(question);
    },(e)=>{
        res.status(400).send(e);
    });
});

// GET /question/api
app.get('/question/api' , (req , res)=>{
    Question.find().then((question)=>{
        res.send({question});
    }, (err)=>{
        res.status(400).send(err);
    });
});

// GET /question/api/:id
app.get('/question/api/:id' , (req , res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id))
    {
        return res.status(400).send();
    }

    Question.findById(id).then((question) => {
        if(!question){
            return res.status(400).send();
        }
        res.send(question);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

// DELETE /question/api/:id
app.delete('/question/api/:id' , (req , res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }

    Question.findByIdAndRemove(id).then((question)=>{
        if(!question){
            res.status(400).send();
        }
        res.send(question);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.listen(port , ()=>{
    console.log(`Listen on port ${port}`);
});


module.exports = {
    app
};