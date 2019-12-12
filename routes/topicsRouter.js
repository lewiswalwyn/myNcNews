const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-C")
const { methodErrorHandler } = require("../errorHandler")


topicsRouter
.route("/")
.get(getTopics)
.all(methodErrorHandler)

module.exports = topicsRouter;