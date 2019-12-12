const commentsRouter = require("express").Router()
const { patchCommentVotes, deleteComment } = require("../controllers/comments-C")
const { methodErrorHandler } = require("../errorHandler")

commentsRouter
.route("/:comment_id")
.patch(patchCommentVotes)
.delete(deleteComment)
.all(methodErrorHandler)

module.exports = commentsRouter;