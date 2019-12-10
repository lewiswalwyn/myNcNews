const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-C")

console.log("In topics router")

topicsRouter
.route("/")
.get(getTopics)

module.exports = topicsRouter;