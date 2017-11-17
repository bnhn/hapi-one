'use strict'

const Hapi = require('hapi');

const Knex = require('./knex');
const CREDS = require('../CREDS');
const routes = require('./routes');

const server = new Hapi.Server();
server.connection({
  port: 9000,
  host: 'localhost'
});

server.register(
  require('hapi-auth-jwt'), (err) => {
  
    server.auth.strategy('token', 'jwt', {
      key: CREDS.key,
      verifyOptions: {
        algorithms: ['HS256']
      }
    });

    routes.forEach((route) => {
      console.log(`Attaching route ${route.path}`);
      server.route(route);
    });
  }
);

server.start(err => {
  if (err) {
    console.log(err.message)
    throw err.message
  }
  console.log(`Server running at ${server.info.uri}`)
});