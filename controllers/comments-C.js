const { updateCommentVotes, removeComment } = require("../models/comments-M")

const patchCommentVotes = function(req, res, next) {

    updateCommentVotes(req.body, req.params)
    .then(response => {
        const comment = response[0]
        res.status(200).send({comment})
    }).catch(next)
}

const deleteComment = function(req, res, next) {

    removeComment(req.params)
    .then(response => res.sendStatus(204)).catch(next)
}

module.exports = { patchCommentVotes, deleteComment }