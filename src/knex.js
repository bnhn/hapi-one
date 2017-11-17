const Knex =  require('knex')({
  client: 'mysql',
  connection: {

    host: '127.0.0.1',

    user: 'birdbase',
    password: 'password',

    database: 'birdbase',
    charset: 'utf8',
  }
})

module.exports = Knex