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
        });
    });
    
});