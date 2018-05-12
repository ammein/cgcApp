var MongoClient = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} = require('./server/db/mongoose');
var {Question} = require('./server/models/question');
var {MyUser} = require('./server/models/user');
const nunjucks = require('nunjucks');
const http = require('http');
// to get certain value of API using lodash
const _ = require('lodash');
const path = require('path');
// Load Socket
const socketIO = require('socket.io');
// Use Cookies
const cookieParser = require('cookie-parser');
require('dotenv').config({
    silent: true
});
// var env = process.env.NODE_ENV || 'development'; // Only in Heroku
var app = express();
const router = express.Router();
// Pass json using POSTMAN
app.use(bodyParser.json());
// Pass json using FORM html METHOD POST
app.use(bodyParser.urlencoded({
    extended: true
}));
// Load static
app.use(express.static(path.join(__dirname, 'public')));
// Load Cookies
app.use(cookieParser());
// Configure nunjucks using multiple template in array
nunjucks.configure('./public', {
    autoescape: false,
    express: app,
    watch: true
});
// intergrate app into our server (SOCKET IO)
var server = http.createServer(app);

// Add websocket server on createServer
var io = socketIO(server);

var port = process.env.PORT || 3000;

app.get('/' , (req , res)=>{
    res.render('input.html');
});

app.get('/play', (req, res)=>{
    res.render('main.html');
    // All socket
    io.on('connection', (client) => {
        client.broadcast.emit('newUser', req.cookies);

        client.on('createMessages', (messages) => {
                MyUser.findOne({
                    from: req.cookies.from
                }).then((user) => {
                    io.emit('newMessages', {
                        user: req.cookies.from,
                        chat: messages,
                        userAnswers : {
                            from : user.from,
                            level : user.level,
                            answers : user.answers
                        }
                    });                    
                });
            console.log("Messages from chat : \n", messages);
        });

        // for disconnect
        client.on('disconnect', () => {
            client.broadcast.emit('userDisconnect' , req.cookies.from)
            console.log(`User disconnected : ${req.cookies.from}`);
        })
    });
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

// APP PATCH LIMIT WITH LEVEL
router.patch('/app/user/:from', (req, res) => {
    var id = req.params;
    // pick key to update the value
    var body = _.pick(req.body, ['level', 'answers', 'from', 'text']);

    MyUser.findOneAndUpdate(id, { $set: body }, { new: true }).then((user) => {
        res.send(user);
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/app/user', (req, res) => {
    MyUser.find()
        .sort('-createdAt')
        .sort('-updatedAt')
        .exec(function(err , users){
            if(err) res.status(400).send(e);
            res.send({users});
        })
});

// APP POST INPUT
router.post('/app/user/input' , (req , res)=>{
    var userAttr = new MyUser({
        from : req.body.from,
    });

    userAttr.save().then((user)=>{    
        res.status(200).cookie("from", user.from, {expire: new Date() + 9999}).redirect('/play');
    },(e)=>{
        res.status(400).send(e);
    });
});

// APP GET INPUT
router.get('/app/user/input/' , (req , res)=>{
    if(req.cookies.from){
        MyUser.findOne({ from: req.cookies.from}).then((user)=>{
            return res.status(200).send({user});
        }, (e)=>{
            return res.status(400).send(e);
        });
    }
    else{
        MyUser.find()
        .then((user)=>{
            res.status(200).send({user});
        },(e)=>{
            res.status(400).send(e);
        });
    }

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
        Question.paginate({}, {page: JSON.parse(req.query.q),limit: 5,sort: {level: +1}}).then((question) => {
            return res.send({question});
        }).catch((e) => {
            return res.status(400).send(e);
        });
    }else if(!req.query.q){
        Question.paginate({}, { limit: 5 , sort : {level : +1} }).then((question) => {
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

server.listen(port , ()=>{
    console.log(`Listen on port ${port}`);
});


module.exports = {
    app,
    nunjucks
};