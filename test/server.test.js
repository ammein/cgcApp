const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Question} = require('./../db/question/question');

beforeEach((done)=>{
    Question.remove({}).then(()=>{
        done();
    });
});

describe('POST /question' , ()=>{
    it('should create new question' , (done)=>{
        var questionString = 'new question enter testing';
        var answers = [20 , 30 ,10 ,40];
        var time = 50;
        request(app)
        .post('/question')
        .send({
            questionString,
            answers,
            time,
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
});