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
        it('GET:404 not a route', () => {
            return request(app)
            .get('/api/tRopics')
            .expect(404)
        });
    });

    describe('/users', () => {
        
    
        describe('/api/users/:username', () => {
            it('GET:200 returns users info', () => {
                return request(app)
                .get('/api/users/lurker')
                .expect(200)
                .then(output => {
                    console.log(output.body)
                    expect(output.body).to.be.an('object')
                    expect(output.body.user).to.be.an('object')
                    expect(output.body.user).to.have.keys('username', 'avatar_url', 'name')
                    expect(Object.keys(output.body).length).to.equal(1)
                })
            });
            it('GET: 400 if username does not exist', () => {
                return request(app)
                .get('/api/users/bumbaclart')
                .expect(400)
                .then(error => {
                    expect(error.status).to.equal(400)
                    expect(error.body.msg).to.equal('username not found')
                })
            })
            it('GET: 404 if url before username is entered wrong', () => {
                return request(app)
                .get('/api/sers/lurker')
                .expect(404)
                .then(error => {
                    expect(error.status).to.equal(404)
                })
            })
        });
    });

    describe.only('/articles', () => {
        describe('/api/articles/:article_id', () => {
            it('GET:200 serves up article object with keys author, title, article_id, body, topic, created_at, votes and comment_count', () => {
                return request(app)
                .get('/api/articles/5')
                .expect(200)
                .then(output => {
                    console.log(output.body)
                    expect(output.body).to.be.an('object')
                    expect(output.body.article).to.be.an('object')
                    expect(output.body.article).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count')
                    expect(Object.keys(output.body).length).to.equal(1)
                    expect(output.body.article.comment_count).to.be.a('number')
                })
            });
        });
    });
});