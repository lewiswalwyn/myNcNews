const connection = require("../db/connection")

const fetchArticleByID = function(id) {

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
            foundArticle[0].comment_count = comments.length.toString()
            return foundArticle
        })
    })
}

const updateArticleVotes = function(upvote, id) {

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

    return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", id.article_id)
    .returning("*")
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => comments);
}

const fetchArticles = function(sort_by, order, author, topic) {
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
    .then( articles => {
/////

        if (!articles.length) { 

            return checkAuthorAndTopicExist(author, topic)
        }
        else return articles
        })
}

const checkAuthorAndTopicExist = function(author, topic) {

    if(author) {
        return connection
        .select("*")
        .from("users")
        .where("username", "=", author)
        .then(authors => {
            if (!authors.length) {
                return Promise.reject({ status: 404, msg: "Author not found" })
            } else if(topic) {
                return connection
                .select("*")
                .from("topics")
                .where("slug", "=", topic)
                .then(topics => {
                    if (!topics.length) {
                        return Promise.reject({ status: 404, msg: "Topic not found" })
                    } else { 
                        return []
                    }
                })
                }
        }
    )} ///// LOOOOOOOOOL but it works tho
    else if(topic) {
        return connection
        .select("*")
        .from("topics")
        .where("slug", "=", topic)
        .then(topics => {
            if (!topics.length) {
                return Promise.reject({ status: 404, msg: "Topic not found" })
            } else { 
                return []
            }
        })
        }
}
module.exports = { 
    fetchArticleByID, 
    updateArticleVotes, 
    insertComment, 
    fetchCommentsByArticleID,
    fetchArticles
};