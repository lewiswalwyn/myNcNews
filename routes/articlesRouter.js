const articlesRouter = require("express").Router()
const { getArticleByID, patchArticleVotes, postComment, getCommentsByArticleID, getArticles } = require("../controllers/articles-C")
const { methodErrorHandler } = require("../errorHandler")

articlesRouter
.route("/:article_id")
.get(getArticleByID)
.patch(patchArticleVotes)
.all(methodErrorHandler)

articlesRouter
.route("/:article_id/comments")
.post(postComment)
.get(getCommentsByArticleID)
.all(methodErrorHandler)

articlesRouter
.route("/")
.get(getArticles)
.all(methodErrorHandler)

module.exports = articlesRouter;