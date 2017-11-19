const CREDS = require('../CREDS')

const Knex = require('knex')({
  client: 'mysql',
  connection: {

    host: CREDS.knex.host,

    user: CREDS.knex.user,
    password: CREDS.knex.password,

    database: CREDS.knex.database,
    charset: CREDS.knex.charset,
  }
})

module.exports = Knex
