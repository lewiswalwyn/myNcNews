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

const updateArticleVotes = function(upvote, id) {
    console.log("in articles model - updateArticleVotes")

    return connection
    .select("*")
    .from("articles")
    .returning("*")
    .where("article_id", "=", id.article_id)
    .increment("votes", upvote.incVotes)
    .then(updatedArticle => {
        return updatedArticle
    });
}

const insertComment = function(myComment, articleID) {
    console.log("in articles model - insertComment")
    
    //formats comment without mutating
    const reformattedComment = JSON.parse(JSON.stringify(myComment))
    reformattedComment.author = reformattedComment.username
    delete reformattedComment.username
    reformattedComment.article_id = articleID.article_id

    return connection
    .insert(reformattedComment)
    .into("comments")
    .returning("*")
    .then(commentArray => commentArray[0])
}

const fetchCommentsByArticleID = function(id, sort_by, order) {
    console.log("in articles model - fetchCommentsByArticleID")

    return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", id.article_id)
    .returning("*")
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => comments);
}

const fetchArticles = function(sort_by, order, author, topic) {
    console.log("in articles model - fetchArticles")

    return connection
    .select("articles.author", "articles.title", "articles.article_id", "articles.topic", "articles.created_at", "articles.votes")
    .from("articles")
    .count({ comment_count: 'comment_id'})
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(query => {
        if (author) query.where( "articles.author", "=", author );
        if (topic) query.where( "articles.topic", "=", topic)
      })
    .orderBy(sort_by || "created_at", order || "desc")
    .returning("*")

}

module.exports = { 
    fetchArticleByID, 
    updateArticleVotes, 
    insertComment, 
    fetchCommentsByArticleID,
    fetchArticles
};