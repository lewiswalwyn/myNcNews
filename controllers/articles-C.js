const { fetchArticleByID, updateArticleVotes, insertComment, fetchCommentsByArticleID, fetchArticles } = require("../models/articles-M")

const getArticleByID = function(req, res, next) {

    fetchArticleByID(req.params)
    .then(response => {
        const article = response[0]
        res.status(200).send({article})
    })
    .catch(next)
}

const patchArticleVotes = function(req, res, next) {

    updateArticleVotes(req.body, req.params)
    .then(response => {
        const article = response[0]
        res.status(200).send({article})
    }).catch(next)
}

const postComment = function(req, res, next) {

    insertComment(req.body, req.params)
    .then(comment => {
        res.status(201).send({comment})
    })
    .catch(next)
}

const getCommentsByArticleID = function(req, res, next) {

    const sort_by = req.query.sort_by
    const order = req.query.order

    fetchCommentsByArticleID(req.params, sort_by, order)
    .then(comments => {
        res.status(200).send({comments})
    })
    .catch(next)
}

const getArticles = function(req, res, next) {

    const sort_by = req.query.sort_by
    const order = req.query.order
    const author = req.query.author
    const topic = req.query.topic

    fetchArticles(sort_by, order, author, topic)
    .then(articles => {
        if (articles.length < 1) res.status(200).send({ articles })
        else res.status(200).send({articles})
    })
    .catch(next)
}

module.exports = { getArticleByID, patchArticleVotes, postComment, getCommentsByArticleID, getArticles }