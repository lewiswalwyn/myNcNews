const { fetchUserByUsername } = require("../models/users-M")

const getUserByUsername = function(req, res, next) {
    
    fetchUserByUsername(req.params)
    .then(response => {
        const user = response[0]
        res.status(200).send({user})
    })
    .catch(next)
}

module.exports = { getUserByUsername }