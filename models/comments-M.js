const connection = require("../db/connection")

const updateCommentVotes = function(upvote, id) {
    return connection
    .select("*")
    .from("comments")
    .returning("*")
    .where("comment_id", "=", id.comment_id)
    .increment("votes", upvote.incVotes)
    .then(updatedComment => {
        return updatedComment
    });
}

const removeComment = function(id) {    
    return connection
    .delete()
    .from("comments")
    .where("comment_id", "=", id.comment_id)
}

module.exports = { updateCommentVotes, removeComment }