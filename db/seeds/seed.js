const { articleData, topicData, commentData, userData } = require('../data/index.js')
//console.log(importedData)

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData);
      const usersInsertions = knex('users').insert(userData);
      return Promise.all([topicsInsertions, usersInsertions])
    .then((stuff) => {
      return knex('articles').insert(formatDates(articleData))
    })
  })
    .then(articleRows => {
      const articleRef = makeRefObj(articleData);
      const formattedComments = formatComments(commentData, articleRef);
      return knex('comments').insert(formattedComments);
    });
};
