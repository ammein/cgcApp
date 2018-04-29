var {MongoClient, ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} = require('./server/db/mongoose');
var {Question} = require('./server/models/question');
const {User} = require('./server/models/user');
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


var port = process.env.PORT || 3000;

app.get('/' , (req , res)=>{
    res.render('input.html');
});

app.get('/character', (req, res)=>{
    res.render('character.html' , {from : req.header('user')});
});

app.get('/create' , (req ,res)=>{
    res.render('create.html');
});

// APP GET LIMIT WITH LEVEL (questions)
router.get('/game/:id' , (req , res)=>{
    var level = req.params.id;
    Question.find()
    .limit(5)
    .where('level').equals(level)
    .then((question)=>{
        res.send({question});
    },(e)=>{
        res.status(400).send(e);
    });
});

router.get('/app/user', (req, res) => {
    User.find({}).then((user) => {
        res.send(user);
    }, (e) => {
        res.status(400).send(e);
    });
});

// APP POST LIMIT WITH LEVEL
router.post('/app/user' , (req , res)=>{
    var userAttr = new User({
        from : req.body.from,
        text : req.body.text,
        level : req.body.level,
        answers : req.body.answers,
    });

    userAttr.save().then((user)=>{
        res.status(200).send(user);
    },(e)=>{
        res.status(400).send(e);
    });
});

// APP POST INPUT
router.post('/app/user/input' , (req , res)=>{
    var userAttr = new User({
        from : req.body.from,
    });

    userAttr.save().then((user)=>{    
        return res.status(200).header('user', user._id).send(user);
    },(e)=>{
        res.status(400).send(e);
    });
});

// APP GET INPUT
router.get('/app/user/input/:id' , (req , res)=>{
    var user = req.header('user');

    User.findByUser(req , user).then((user)=>{
        res.send(user);
    },(e)=>{
        res.status(400).send(e);
    });
    res.send(user);
});

// APP POST LIMIT WITH LEVEL
router.patch('/app/user/:id' , (req , res)=>{
    var id = req.params.id;
    // pick key to update the value
    var body = _.pick(req.body, ['level', 'answers', 'from', 'text']);
    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }

    User.findByIdAndUpdate(id , {$set : body} , {new : true}).then((user)=>{
        res.send(user);
    },(e)=>{
        res.status(400).send(e);
    });
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
        res.status(200).redirect('/create');
    },(e)=>{
        res.status(400).send(e);
    });
});

// GET /api/question
router.get('/question' , (req , res)=>{
    if(req.query.q){
        Question.paginate({}, { page: JSON.parse(req.query.q), limit: 5 }).then((question) => {
            return res.send({question});
        }).catch((e) => {
            return res.status(400).send(e);
        });
    }else if(!req.query.q){
        Question.paginate({}, { limit: 5 }).then((question) => {
            return res.send({ question });
        }).catch((e) => {
            return res.status(400).send(e);
        });
    }
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

// 404 PAGE NOT FOUND . MUST PUT ON VERY BOTTOM OF THE PAGE
app.get('*' , (req, res)=>{
    res.status(404).render('404.html');
})

app.listen(port , ()=>{
    console.log(`Listen on port ${port}`);
});


module.exports = {
    app,
    nunjucks
};