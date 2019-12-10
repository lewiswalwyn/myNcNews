const connection = require("../db/connection")

const fetchTopics = function() {
    console.log("In topics model - fetchTopics")
   
    return connection
    .select("*")
    .from("topics")
    .returning("*")
}

module.exports = { fetchTopics };