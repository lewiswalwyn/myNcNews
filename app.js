const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter")
const { psqlErrorHandler, baseErrorHandler, miscErrorHandler, methodErrorHandler } = require("./errorHandler")
const cors = require('cors');

app.use(cors());


app.use(express.json());


app.use("/api", apiRouter);
//"/*"
//error handling

app.use(psqlErrorHandler)


app.use(miscErrorHandler);

app.use(baseErrorHandler)



module.exports = app;