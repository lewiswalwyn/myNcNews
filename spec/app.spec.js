process.env.NODE_ENV = "test";
const { expect } = require('chai');
const request = require('supertest');
const connection = require('../db/connection')
const app = require('../app')

describe('/api', () => {

    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());

    describe('/topics', () => {
        it('GET:200 serves all topics' , () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(output => {
                expect(output.body).to.be.an('Object')
                expect(output.body.topics).to.be.an('Array')
                
                output.body.topics.forEach(topic => {
                    expect(topic).to.be.an('Object')
                    expect(topic).to.have.keys("slug", "description")
                })
                

                
            })
        });
    });
    
});