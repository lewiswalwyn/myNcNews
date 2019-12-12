process.env.NODE_ENV = "test";
const chai = require('chai');
const chaiSorted = require("sams-chai-sorted");
const { expect } = require("chai")
const request = require('supertest');
const connection = require('../db/connection')
chai.use(chaiSorted);
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

    describe('/articles', () => {
        describe('/api/articles/:article_id', () => {
            it('GET:200 serves up article object with keys author, title, article_id, body, topic, created_at, votes and comment_count', () => {
                return request(app)
                .get('/api/articles/5')
                .expect(200)
                .then(output => {
                    expect(output.body).to.be.an('object')
                    expect(output.body.article).to.be.an('object')
                    expect(output.body.article).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count')
                    expect(Object.keys(output.body).length).to.equal(1)
                    expect(output.body.article.comment_count).to.be.a('number')
                });
            });
            it('PATCH:200 accepts an object { incVotes : newVote } where newVote is a number that will inc or dec votes property', () => {
                const upvote = { incVotes : 1000 }
                return request(app)
                .patch('/api/articles/1')
                .send(upvote)
                .expect(200)
                .then(output => {
                    expect(output.body.article.votes).to.equal(1100)
                })
            });
            it('PATCH:200 same as above but decreases votes with negative numbers', () => {
                const upvote = { incVotes : -1000 }
                return request(app)
                .patch('/api/articles/1')
                .send(upvote)
                .expect(200)
                .then(output => {
                    expect(output.body.article.votes).to.equal(-900)
                })
            });
        });
        describe('/api/articles/:article_id/comments', () => {
            it('POST 201 req body accepts object with username and body, responds with the posted comment', () => {
                const myComment = { username: "butter_bridge", body: "YAS KWEEN" }
                return request(app)
                .post('/api/articles/1/comments')
                .send(myComment)
                .expect(201)
                .then(output => {
                    expect(output.body).to.be.an('object')
                    expect(output.body).to.have.key('comment')
                    expect(output.body.comment).to.have.all.keys("comment_id", "author", "article_id", "votes", "created_at", "body")
                })
            });
            it('GET: 200 serves up all array of all comments for given article ID', () => {
                return request(app)
                .get('/api/articles/5/comments')
                .expect(200)
                .then(output => {
                    expect(output.body.comments).to.be.an('array')
                    expect(output.body.comments[0]).to.have.all.keys("comment_id", "votes", "created_at", "author", "body")
                    expect(output.body.comments[0]).not.to.have.key("article_id")
                })
            }); ///// what if article has no comments what then huh?
            it('GET: 200 sorted by votes - defaults to descending order', () => {
                return request(app)
                .get('/api/articles/1/comments?sort_by=votes') 
                .expect(200)
                .then(output => {
                    expect(output.body.comments).to.be.descendingBy("votes")
                })  
            });
            it('GET: 200 sorted by created_at (default) but in asc order', () => {
                return request(app)
                .get('/api/articles/1/comments?order=asc') 
                .expect(200)
                .then(output => {
                    expect(output.body.comments).to.be.ascendingBy("created_at")
                })  
            });
        });
        describe('/api/articles', () => {
            it('GET: 200 responds with full array of articles (minus body) including comment count', () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(output => {
                    expect(output.body).to.be.an('object')
                    expect(output.body).to.have.key('articles')
                    expect(output.body.articles).to.be.an('array')
                    expect(output.body.articles[0]).to.have.all.keys("author", "title", "article_id", "topic", "created_at", "votes", "comment_count")
                    expect(output.body.articles[0]).to.not.have.key("body")
                })
            });
            it('GET: 200 sorts by valid column defaulting to desc order', () => {
                return request(app)
                .get('/api/articles?sort_by=comment_count')
                .expect(200)
                .then(output => {
                    expect(output.body.articles).to.be.descendingBy("comment_count")
                })
            });
            it('GET: 200 sorts by valid column in asc order', () => {
                return request(app)
                .get('/api/articles?sort_by=comment_count&order=asc')
                .expect(200)
                .then(output => {
                    expect(output.body.articles).to.be.ascendingBy("comment_count")
                })
            });
            it('GET: 200 filters by author when given username in query', () => {
                return request(app)
                .get('/api/articles?author=butter_bridge')
                .expect(200)
                .then(output => {
                    output.body.articles.forEach(article => {
                        expect(article.author).to.equal("butter_bridge")
                    })
                })
            });
            it('GET: 200 filters by author when given username in query', () => {
                return request(app)
                .get('/api/articles?topic=cats')
                .expect(200)
                .then(output => {
                    output.body.articles.forEach(article => {
                        expect(article.topic).to.equal("cats")
                    })
                })
            });
        });
        //////////////
        describe('/api/articles ERRORS... ish', () => {
            it('GET 200 author + topic exist but author has no articles on the topic', () => {
                return request(app)
                .get('/api/articles?author=butter_bridge&topic=cats')
                .expect(200)
                .then(output => {
                    expect(output.body.articles).to.deep.equal([])
                })
            });
            it('ERROR - GET 404 author exists but topic does not', () => {
                return request(app)
                .get('/api/articles?author=butter_bridge&topic=not_a_topic')
                .expect(404)
                .then(output => {
                    expect(output.body.msg).to.equal('Topic not found')
                })
            })
            it('ERROR - GET 404 topic exists but author does not', () => {
                return request(app)
                .get('/api/articles?author=not_an_author&topic=cats')
                .expect(404)
                .then(output => {
                    expect(output.body.msg).to.equal('Author not found')
                })
            })
        });
    });
    describe('/api/comments', () => {
        describe('/api/comments/:comment_id', () => {
            it('PATCH:200 accepts an object { incVotes : newVote } where newVote is a number that will inc or dec votes property', () => {
                const upvote = { incVotes : 10000 }
                return request(app)
                .patch('/api/comments/3')
                .send(upvote)
                .expect(200)
                .then(output => {
                    expect(output.body.comment.votes).to.equal(10100)
                })
            });
            it('DELETE: 204 deletes comment at :comment_id', () => {
                return request(app)
                .delete("/api/comments/1")
                .expect(204)
                .then(output => {
                    expect(output.body).to.deep.equal({})
                    
                    return connection
                    .select("*")
                    .from("comments")
                    .then(remainingComments => {
                        expect(remainingComments.length).to.equal(17)
                    })
                })
            })
        });
    });
});