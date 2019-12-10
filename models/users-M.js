const connection = require("../db/connection")

const fetchUserByUsername = function(username) {
    console.log("In users model - fetchUserByUsername")


    return connection
    .select("*")
    .from("users")
    .returning("*")
    .where("username", "=", username.username)
    .then((result) => {
        //console.log(result)
        if(result.length < 1) { 
            return Promise.reject({
            status: 400,
            msg: "username not found"
            })
            } else return result
        })
}

module.exports = { fetchUserByUsername };