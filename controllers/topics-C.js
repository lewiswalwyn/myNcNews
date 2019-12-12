const { fetchTopics } = require("../models/topics-M")

const getTopics = function(req, res, next) {
    fetchTopics()
    .then(topics => {
        res.status(200).send({topics})
    }).catch(next)
}

module.exports = { getTopics }