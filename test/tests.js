"use strict";

process.env.NODE_ENV = 'test';

// chai.should();
//
// chai.use(chaiHttp);
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const assert = require('assert');
const server = require('../app.js');
const { exit } = require('process');

chai.use(chaiHttp);


mongoose.connect('mongodb://localhost/mumin');
mongoose.Promise = global.Promise;


describe("POST /Save", () => {
    it("201 HAPPY PATH", (done) => {
        chai.request(server)
            .post("/save")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ data: '<p>linnea5</p>\n', filename: 'linnea5.txt' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                //res.should.be.an("object");

                done();
        });
    });
});
describe('Reading file name', () => {
    it('finds name of doc', (done) => {
        mongoose.connection.collection("crowd").findOne({ filename: 'linnea5.txt' })
            .then((theDoc) => {
                assert(theDoc.filename === 'linnea5.txt'); 
                done();
            });
    })
})

    describe('Start', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH start found', (done) => {
            chai.request(server)
                .get('/hello')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object");
                    expect(res.body.data).to.be.an("object");
                    expect(res.body.data).to.have.keys({ msg: 'Hello World' });
                    done();
                });
        });
    });
});

describe('Data', () => {
    describe('GET /getdata', () => {
        it('200 HAPPY PATH data found', (done) => {
            chai.request(server)
                .get('/getdata')
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    done();
                });
        });
    });
});