const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-C")


topicsRouter
.route("/")
.get(getTopics)

module.exports = topicsRouter;