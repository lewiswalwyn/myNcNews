// module.exports = { 
//     articleData: require('./articles.js'),
//     commentData: require('./comments'),
//     topicData: require('./topics'),
//     userData : require('./users')
// }

const articleData = require('./articles.js');
const topicData = require('./topics');
const commentData = require('./comments');
const userData = require('./users')

module.exports = { articleData, topicData, commentData, userData}