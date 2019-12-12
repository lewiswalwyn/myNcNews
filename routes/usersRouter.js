const usersRouter = require("express").Router()
const { getUserByUsername } = require("../controllers/users-C")

usersRouter
.route("/:username")
.get(getUserByUsername)

module.exports = usersRouter;