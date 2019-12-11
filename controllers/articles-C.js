const { fetchArticleByID, updateArticleVotes, insertComment, fetchCommentsByArticleID, fetchArticles } = require("../models/articles-M")

const getArticleByID = function(req, res, next) {
    console.log("in articles controller - getArticleByID")

    fetchArticleByID(req.params)
    .then(response => {
        const article = response[0]
        res.status(200).send({article})
    })
    .catch(next)
}

const patchArticleVotes = function(req, res, next) {
    console.log("in articles controller - patchArticleVotes")

    updateArticleVotes(req.body, req.params)
    .then(response => {
        const article = response[0]
        res.status(200).send({article})
    })
}

const postComment = function(req, res, next) {
    console.log("in articles controller - postComment")

    insertComment(req.body, req.params)
    .then(comment => {
        res.status(201).send({comment})
    })
}

const getCommentsByArticleID = function(req, res, next) {
    console.log("in articles controller - getCommentsByArticleID")

    const sort_by = req.query.sort_by
    const order = req.query.order

    fetchCommentsByArticleID(req.params, sort_by, order)
    .then(comments => {
        res.status(200).send({comments})
    })
}

const getArticles = function(req, res, next) {
    console.log("in articles controller - getArticles")

    const sort_by = req.query.sort_by
    const order = req.query.order
    const author = req.query.author
    const topic = req.query.topic

    fetchArticles(sort_by, order, author, topic)
    .then(articles => {
        res.status(200).send({articles})
    })
}

module.exports = { getArticleByID, patchArticleVotes, postComment, getCommentsByArticleID, getArticles }