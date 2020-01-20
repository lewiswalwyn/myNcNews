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

    it('ERROR - DELETE 405 method not found', () => {
        return request(app)
        .delete("/api")
        .expect(405)
    });
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
        it('ERROR - PATCH 405 method not allowed', () => {
            return request(app)
            .patch('/api/topics')
            .expect(405)
        })
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
            it('GET: 404 if username does not exist', () => {
                return request(app)
                .get('/api/users/bumbaclart')
                .expect(404)
                .then(error => {
                    expect(error.status).to.equal(404)
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
            it('ERROR - PUT 405 method not found', () => {
                return request(app)
                .put("/api/users/butter_bridge")
                .expect(405)
            });
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
                    expect(output.body.article.comment_count).to.be.a('string')
                });
            });
            it('PATCH:200 accepts an object { inc_votes : newVote } where newVote is a number that will inc or dec votes property', () => {
                const upvote = { inc_votes : 1000 }
                return request(app)
                .patch('/api/articles/1')
                .send(upvote)
                .expect(200)
                .then(output => {
                    expect(output.body.article.votes).to.equal(1100)
                })
            });
            it('PATCH:200 same as above but decreases votes with negative numbers', () => {
                const upvote = { inc_votes : -1000 }
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
            it('GET 200 serves empty array when article exists but has no comments', () => {
                return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
            })
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
            it('ERROR - PUT 405 method not found', () => {
                return request(app)
                .put("/api/articles/1")
                .expect(405)
            });
            it('ERROR - PATCH 400 invalid inc_votes value', () => {
                return request(app)
                .patch("/api/articles/1")
                .send({ inc_votes: "no"})
                .expect(400)
            });
            it('ERROR - PATCH ignore request with no info in body', () => {
                return request(app)
                .patch("/api/articles/1")
                .then(output => {
                    expect(output.body.article.votes).to.equal(100)
                })
            });
            it('ERROR - PUT 405 method not found', () => {
                return request(app)
                .put("/api/articles/1/comments")
                .expect(405)
            });
            it('ERROR - GET 400 invalid article_id', () => {
                return request(app)
                .get("/api/articles/not-a-valid-id/comments")
                .expect(400)
            });
            it('ERROR - POST 400 invalid article_id', () => {
                return request(app)
                .post("/api/articles/not-a-valid-id/comments")
                .expect(400)
            });
            it('ERROR - GET 404 valid but non existent article_id', () => {
                return request(app)
                .get("/api/articles/10000/comments")
                .expect(404)
            });
            it('ERROR - POST 400 valid but non existent article_id', () => {
                return request(app)
                .post("/api/articles/10000/comments")
                .expect(400)
            });
            it('ERROR - POST 400 request does not include all required keys', () => {
                const myComment = { username: "butter_bridge" }
                return request(app)
                .post('/api/articles/1/comments')
                .send(myComment)
                .expect(400)
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
            it('GET 200 - invalid sort by column', () => {
                return request(app)
                .get('/api/articles?sort_by=not-a-column')
                .expect(200)
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
            it('GET: 200 returns empty array when topic exists but has no articles', () => {
                return request(app)
                .get("/api/articles?author=lurker")
                .expect(200)
                .then(output => {
                    expect(output.body).to.deep.equal({articles: []})
                })
            });
        });
        //////////////
        describe('/api/articles ERRORS...', () => {
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

            it('GET 200 - invalid sort by column', () => {
                return request(app)
                .get('/api/articles/1/comments?sort_by=not-a-valid-column')
                .expect(200)
            });

            it('ERROR - PATCH 405 method not allowed', () => {
                return request(app)
                .patch("/api/articles")
                .expect(405)
            });
            //////BELOW IS A HOT MESS
            it('ERROR - GET 404 non-existent topic', () => {
                return request(app)
                .get("/api/articles?topic=not-a-topic")
                .expect(404)
            });
            it('ERROR - GET 404 valid article id but does not exist', () => {
                return request(app)
                .get("/api/articles/1000")
                .expect(404)
            });
            it('ERROR - GET 400 bad request if article id type is invalid e.g a string', () => {
                return request(app)
                .get("/api/articles/dog")
                .expect(400)
            });
        });
    });
    describe('/api/comments', () => {
        describe('/api/comments/:comment_id', () => {
            it('PATCH:200 accepts an object { inc_votes : newVote } where newVote is a number that will inc or dec votes property', () => {
                const upvote = { inc_votes : 10000 }
                return request(app)
                .patch('/api/comments/3')
                .send(upvote)
                .expect(200)
                .then(output => {
                    expect(output.body.comment.votes).to.equal(10100)
                })
            });
            it('ERROR PATCH 400 bad request when sent invalid inc_votes value', () => {
                const upvote = { inc_votes : "no" }
                return request(app)
                .patch('/api/comments/3')
                .send(upvote)
                .expect(400)
            });
            it('ERROR PATCH 400 not a valid comment_id', () => {
                const upvote = { inc_votes : 10000 }
                return request(app)
                .patch('/api/comments/not-valid')
                .send(upvote)
                .expect(400)
            });
            it('ERROR PATCH 404 valid comment_id but does not exist', () => {
                const upvote = { inc_votes : 10000 }
                return request(app)
                .patch('/api/comments/1000')
                .send(upvote)
                .expect(404)
            });
            it('PATCH 200: OK when sent body with no inc_votes property, returns unchanged comment', () => {
                const noVote = {}
                return request(app)
                .patch('/api/comments/1')
                .send(noVote)
                .expect(200)
                .then(output => {
                    expect(output.body.comment.votes).to.equal(16)
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
            it('ERROR - PUT 405 method not found', () => {
                return request(app)
                .put("/api/comments/1")
                .expect(405)
            });
            it('ERROR - DELETE 400 if comment id NaN', () => {
                return request(app)
                .delete("/api/comments/not-a-number")
                .expect(400)
            });
            it('ERROR - DELETE 404 valid id but does not exist', () => {
                return request(app)
                .delete("/api/comments/1000")
                .expect(404)
            });
        });
    });
});