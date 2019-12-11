const articlesRouter = require("express").Router()
const { getArticleByID, patchArticleVotes, postComment, getCommentsByArticleID, getArticles } = require("../controllers/articles-C")

console.log("In articles router")

articlesRouter
.route("/:article_id")
.get(getArticleByID)
.patch(patchArticleVotes)

articlesRouter
.route("/:article_id/comments")
.post(postComment)
.get(getCommentsByArticleID)

articlesRouter
.route("/")
.get(getArticles)

module.exports = articlesRouter;