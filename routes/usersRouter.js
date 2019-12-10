const usersRouter = require("express").Router()
const { getUserByUsername } = require("../controllers/users-C")

console.log("In users router")

usersRouter
.route("/:username")
.get(getUserByUsername)

module.exports = usersRouter;