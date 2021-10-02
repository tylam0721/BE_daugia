module.exports = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'us-cdbr-east-04.cleardb.com',
      port : 3306,
      user : 'ba38a07b1db2d4',
      password : 'd807a190',
      database : 'heroku_2a8e93721c7194c'
    }
  });