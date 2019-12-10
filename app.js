const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter")

app.use("/api", apiRouter);

//error handler
app.use(function(err, req, res, next) {
    console.log("in error handler")
    console.log(err)
    res.status(500).send({ msg: "BUMBACLART"})
});

module.exports = app;