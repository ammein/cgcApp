const expect = require('expect');
const request = require('supertest');
const {app} = require('./../../server');
const {Question} = require('./../models/question');

const question = [{
    questionString : 'new question enter testing',
    answers: [20, 30, 10, 40],
    time : 50
},{
    questionString : '',
    time : null
}];

beforeEach((done)=>{
    Question.remove({}).then(()=>{
        return Question.insertMany(question);
    }).catch(()=> done());
});

describe('POST /question' , ()=>{
    it('should create new question' , (done)=>{
        var questionString= 'new question enter testing';
        var answers= [20, 30, 10, 40];
        var time = 50;
        request(app)
        .post('/question')
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
                time,
            });
        })
        .end((err , res)=>{
            if(err)
            {
                done(err);
            }

            Question.find({}).then((question)=>{
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });

    it('should not create new question if empty' , (done)=>{
        var questionString = '';
        var time = null;
        request(app)
        .post('/question')
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
        .post('/question')
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
        .post('/question')
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
        .post('/question')
        .send({
            questionString,
            answers
        })
        .expect(400)
        .end(done);
    });
});