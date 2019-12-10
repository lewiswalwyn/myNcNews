const connection = require("../db/connection")

const fetchArticleByID = function(id) {

    console.log('in articles model - fetchArticleByID')

    return connection
    .select("*")
    .from("articles")
    .returning("*")
    .where("article_id", "=", id.article_id)
    .then(article => {
        const foundArticle = article;
        return connection
        .select("*")
        .from("comments")
        .returning("*")
        .where("article_id", "=", id.article_id)
        .then(comments => {
            foundArticle[0].comment_count = comments.length
            return foundArticle
        })
    })
}
// select comment_id, article_id, votes, created_at from comments join articles on comments.belongs_to=articles.title;
module.exports = { fetchArticleByID };