var {MongoClient, ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} = require('./server/db/mongoose');
var {Question} = require('./server/models/question');
const nunjucks = require('nunjucks');
// to get certain value of API using lodash
const _ = require('lodash');
const path = require('path');
// var env = process.env.NODE_ENV || 'development'; // Only in Heroku
var app = express();
const router = express.Router();
// Pass json using POSTMAN
app.use(bodyParser.json());
// Pass json using FORM html METHOD POST
app.use(bodyParser.urlencoded({extended: true}));
// Load static
app.use(express.static(path.join(__dirname, 'public')))
// Configure nunjucks using multiple template in array
nunjucks.configure(['./app' , './public'], {
    autoescape: false,
    express: app,
    watch : true
});

// Deploy Setting
// if(env === 'development'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/QuestionApp';
// }else if(env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/QuestionAppTest';
// }

var port = process.env.PORT || 3000;

app.get('/' , (req ,res)=>{
    var data = {
        questionString : req.body.questionString,
        answers : req.body.answers,
        time : req.body.time
    };
    res.render('index.html' , data);
});

// POST Question & Answers
router.post('/question' , (req , res)=>{
    var newQuestion = new Question({
        questionString: req.body.questionString,
        answers: req.body.answers,
        time : req.body.time,
        level : req.body.level
    });

    newQuestion.save().then((question)=>{
        res.status(200).redirect('/');
    },(e)=>{
        res.status(400).send(e);
    });
});

// GET /api/question
router.get('/question' , (req , res)=>{
    Question.find().then((question)=>{
        res.send({question});
    }, (err)=>{
        res.status(400).send(err);
    });
});

// GET /api/question/:id
router.get('/question/:id' , (req , res)=>{
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

// DELETE /api/question/:id
router.delete('/question/:id' , (req , res)=>{
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

// PATCH/UPDATE /api/question/:id
router.patch('/question/:id' , (req,res)=>{
    var id = req.params.id;
    // pick key to update the value
    var body = _.pick(req.body , ['questionString' , 'answers' , 'time' , 'level']);
    if(!ObjectID.isValid(id))
    {
        return res.status(400).send();
    }
    Question.findByIdAndUpdate(id , {$set : body} , {new : true}).then((question)=>{
        if(!question)
        {
            return res.status(400).send();
        }
        res.send(question);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});


// Tell express to use this router with /api before.
// You can put just '/' if you don't want any sub path before routes.
app.use('/api' , router);

app.listen(port , ()=>{
    console.log(`Listen on port ${port}`);
});


module.exports = {
    app,
    nunjucks
};