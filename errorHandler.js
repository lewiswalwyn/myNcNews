const psqlErrorHandler = function(err, req, res, next) {
    const psqlCodes = {
        "42703": { status: 404, msg: "Topic not found"},
        "22P02": { status: 400, msg: "Bad Request" },
        "23502": { status: 422, msg: "Article does not exist" },
        "23503": { status: 422, msg: "Article does not exist" }
    }
    const currentError = psqlCodes[err.code]

    if (currentError) res.status(currentError.status).send({ msg: currentError.msg })
    else next(err)
}

const miscErrorHandler = function(err, req, res, next) {
    if(err.status === 404) res.status(err.status).send({ msg: err.msg })
    else if(err.status === 400) res.status(err.status).send({ msg: err.msg })
    else next(err)
}

const methodErrorHandler = function(req, res, next) {
    res.status(405).send({ msg: "Method not found"})
}

const baseErrorHandler = function(err, req, res, next) {
    console.log("IN FINAL SERVER ERROR!!!")
    console.log(err);

    res.status(500).send({ msg: "BUMBACLART"})
}

module.exports = { psqlErrorHandler, baseErrorHandler, miscErrorHandler, methodErrorHandler }