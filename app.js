const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter")

app.use(express.json());


app.use("/api", apiRouter);


//error handling
app.use(function(err, req, res, next) {
    if(err.status === 400) res.status(err.status).send({ msg: err.msg })

    //FINAL SERVER ERROR
    res.status(500).send({ msg: "BUMBACLART"})
});

module.exports = app;