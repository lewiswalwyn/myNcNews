const articlesRouter = require("express").Router()
const { getArticleByID } = require("../controllers/articles-C")

console.log("In articles router")

articlesRouter
.route("/:article_id")
.get(getArticleByID)

module.exports = articlesRouter;