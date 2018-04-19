const expect = require('expect');
const request = require('supertest');
const {app} = require('./../../server');
const {Question} = require('./../models/question');
const {ObjectID} = require('mongodb');

const question = [{
    _id: new ObjectID().toHexString(),
    questionString: 'new question enter testing',
    answers: [20, 30, 10, 40],
    time: 50
}, {
    _id: new ObjectID().toHexString(),
    questionString: 'Other Question ?',
    answers: [90, 63, 51, 23],
    time: 60
}, {
    _id: new ObjectID().toHexString(),
    questionString: 'Something to be told',
    answers : [23 ,31 ,23],
    time: 30
}];

describe('POST /question/api' , ()=>{
    it('should create new question' , (done)=>{
        after((done)=>{
            Question.remove({}).then(()=>{
                return Question.insertMany(question , done());
            }).catch((e)=> done(e));
        });
        var questionString= question[0].questionString;
        var answers= question[0].answers;
        var time = question[0].time;
        request(app)
        .post('/question/api')
        .send({
            questionString,
            answers,
            time
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body).toInclude({
                questionString,
                answers,
                time
            });
        })
        .end((err , res)=>{
            if(err)
            {
                return done(err);
            }
            Question.find({}).then((question)=>{
                expect(question.length).toBe(1);
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });

    it('should not create new question if empty' , (done)=>{
        before((done) => {
            Question.remove({}).then(() => {
                return Question.insertMany(question, done());
            }).catch((e) => done(e));
            console.log("beforeEach POST");
        });
        var questionString = '';
        var time = null;
        request(app)
        .post('/question/api')
        .send({
            questionString,
            time
        })
        .expect(400)
        .end(done);
    });

    it('should not create a string with 2 characters' , (done)=>{
        var questionString = 'as';        
        request(app)
        .post('/question/api')
        .send({
            questionString
        })
        .expect(400)
        .end(done);
    });

    it('should not send too many answers' , (done)=> {
        var answers = [23 ,23,12,35,12];
        var questionString = "For too many answers";

        request(app)
        .post('/question/api')
        .send({
            questionString,
            answers
        })
        .expect(400)
        .end(done);
    });

    it('should not send without an answers' , (done)=>{
        var answers = [];
        var questionString = "Without Answers";
        
        request(app)
        .post('/question/api')
        .send({
            questionString,
            answers
        })
        .expect(400)
        .end(done);
    });
});

describe('GET /question/api' , ()=>{
    it('should get all question api' , (done)=>{
        before((done) => {
            Question.remove({}).then(() => {
                return Question.insertMany(question, done());
            }).catch((e) => done(e));
            console.log("before GET 2");
        });
        request(app)
        .get('/question/api')
        .expect(200)
        .end(done);
    });

    it('should get specific question ObjectID' , (done)=>{
        before((done) => {
            Question.remove({}).then(() => {
                return new Question({question});
                done();
            }).catch((e) => done(e));
            console.log("before GET 2");
            done();
        });
        var id = question[0]._id.toHexString();
        // console.log("Id : ",id);
        // done();
        request(app)
        .get(`/question/api/${id}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.question.questionString).toBe(question[0].questionString);
        })
        .end(done);
    });
});