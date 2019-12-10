const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter")
const articlesRouter = require("./articlesRouter")

console.log("In api router");

apiRouter.use("/topics", topicsRouter)
apiRouter.use("/users", usersRouter)
apiRouter.use("/articles", articlesRouter)

module.exports = apiRouter;