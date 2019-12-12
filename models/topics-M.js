const connection = require("../db/connection")

const fetchTopics = function() {
   
    return connection
    .select("*")
    .from("topics")
    .returning("*")
}

module.exports = { fetchTopics };