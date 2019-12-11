const { updateCommentVotes, removeComment } = require("../models/comments-M")

const patchCommentVotes = function(req, res, next) {
    console.log("in comments controller - patchCommentVotes")

    updateCommentVotes(req.body, req.params)
    .then(response => {
        const comment = response[0]
        res.status(200).send({comment})
    })
}

const deleteComment = function(req, res, next) {
    console.log("in comments controller - deleteComment")

    removeComment(req.params)
    .then(response => res.sendStatus(204))
}

module.exports = { patchCommentVotes, deleteComment }