const connection = require("../db/connection")

const updateCommentVotes = function(upvote, id) {
    if (!upvote.inc_votes) {upvote.inc_votes = 0}

    return connection
    .select("*")
    .from("comments")
    .returning("*")
    .where("comment_id", "=", id.comment_id)
    .increment("votes", upvote.inc_votes)
    .then(updatedComment => {
        if(!updatedComment.length) { return Promise.reject({ status: 404, msg: "Comment not found" })}
        else return updatedComment
    });
}

const removeComment = function(id) {    
    return connection
    .delete()
    .from("comments")
    .where("comment_id", "=", id.comment_id)
    .then(comment => {
        if(!comment){ return Promise.reject({ status: 404, msg: "Comment not found" })}
    })
}

module.exports = { updateCommentVotes, removeComment }