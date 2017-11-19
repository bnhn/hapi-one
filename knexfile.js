const CREDS = require('./CREDS')

module.exports = {

  development: {

    migrations: { tableName: 'knex_migrations' },
    seeds: { tableName: './seeds' },

    client: 'mysql',
    connection: {

      host: CREDS.knex.host,

      user: CREDS.knex.user,
      password: CREDS.knex.password,

      database: CREDS.knex.database,
      charset: CREDS.knex.charset,

    }

  }

};
