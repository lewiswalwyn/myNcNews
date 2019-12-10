const { fetchArticleByID } = require("../models/articles-M")

const getArticleByID = function(req, res, next) {

    console.log("in articles controller - getArticleByID")

    fetchArticleByID(req.params)
    .then(response => {
        const article = response[0]
        res.status(200).send({article})
    })
    .catch(next)
}

module.exports = { getArticleByID }