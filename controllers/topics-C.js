const { fetchTopics } = require("../models/topics-M")

const getTopics = function(req, res, next) {
    console.log("In topics controller - getTopics")
    fetchTopics()
    .then(topics => res.status(200).send(topics))
}

module.exports = { getTopics }