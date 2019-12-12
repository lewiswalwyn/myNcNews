const connection = require("../db/connection")

const fetchUserByUsername = function(username) {

    return connection
    .select("*")
    .from("users")
    .returning("*")
    .where("username", "=", username.username)
    .then((result) => {
        if(result.length < 1) { 
            return Promise.reject({
            status: 404,
            msg: "username not found"
            })
            } else return result
        })
}

module.exports = { fetchUserByUsername };