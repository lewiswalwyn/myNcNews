const usersRouter = require("express").Router()
const { getUserByUsername } = require("../controllers/users-C")
const { methodErrorHandler } = require("../errorHandler")

usersRouter
.route("/:username")
.get(getUserByUsername)
.all(methodErrorHandler)

module.exports = usersRouter;