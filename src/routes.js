const jwt = require('jsonwebtoken');
const GUID = require('uuid');

const Knex = require('./knex');
const CREDS = require('../CREDS');

const routes = [
  {
    method: 'GET',
    path: '/birds',
    handler(request, reply) {
      const getOperation = Knex('birds')
        .where({
          isPublic: true
        })
        .select('name', 'species', 'picture_url')
        .then((result) => {

          if (!result || result.length === 0) {
            reply({
              error: true,
              errMessage: 'public bird not found'
            })
          }

          reply({
            dataCount: result.length,
            data: result
          })
        }).catch((err) => {
          reply('server-side error')
        })
    }
  },

  {
    method: 'POST',
    path: '/auth',
    handler(request, reply) {
      if (!request.payload) {
        console.log('no payload received')
        reply('no payload')
        return
      }
      const { username, password } = request.payload;

      const getOperation = Knex('users')
        .where({ username })
        .select('guid', 'password')
        .then(([user]) => {

          if (!user) {
            reply({
              error: true,
              errMessage: 'User not found'
            })
            return
          }

          if (user.password == password) {
            const token = jwt.sign({
              username,
              scope: user.guid
            }, CREDS.key, {
                algorithm: 'HS256',
                expiresIn: '1h'
              });

            reply({
              token,
              scope: user.guid
            })
          } else {
            reply('Incorrect password')
          }
        }).catch((err) => {
          console.log(err)
          reply('Server-side error')
        })
    }
  },

  {
    method: 'POST',
    path: '/birds',
    config: {
      auth: {
        strategy: 'token'
      }
    },
    handler(request, reply) {
      if (!request.payload.bird) {
        console.log('no payload received')
        reply('no payload')
        return
      }
      const { bird } = request.payload;
      const guid = GUID.v4();

      const insertOperation = Knex('birds').insert({
        owner: request.auth.credentials.scope,
        name: bird.name,
        species: bird.species,
        picture_url: bird.picture_url,
        guid
      }).then((res) => {
        console.log(res)
        reply({
          data: guid,
          message: `successfully created bird: ${request.payload.bird.name}`
        })
      }).catch((err) => {
        console.log(err)
        reply('server-side error')
      })
    }
  },

  {
    method: 'PUT',
    path: '/birds/{birdGuid}',
    config: {
      auth: {
        strategy: 'token'
      },
      pre: [
        {
          method(request, reply) {
            const { birdGuid } = request.params
            , { scope } = request.auth.credentials;

            const getOperation = Knex('birds')
            .where({
              guid: birdGuid
            })
            .select('owner')
            .then( ([result]) => {
              if (!result) {
                reply({
                  error: true,
                  errMessage: `bird with id ${birdGuid} not found`
                }).takeover()
              }

              if (result.owner === !scope) {
                reply({
                  error: true,
                  errMessage: 'bird not in scope, cannot edit'
                }).takeover()
              }

              return reply.continue
            })
          }
        }
      ]
    },
    handler(request, reply) {
      if (!request.payload.bird) {
        console.log('no payload received')
        reply('no payload')
        return
      }
      const { bird } = request.payload
      , birdGuid = request.params;

      const insertOperation = Knex('birds')
      .where({
        guid: birdGuid
      })
      .update({
        name: bird.name,
        species: bird.species,
        picture_url: bird.picture_url,
        isPublic: bird.isPublic
      }).then((res) => {
        console.log(res)
        reply({
          data: guid,
          message: `successfully updated bird: ${request.payload.bird.name}`
        })
      }).catch((err) => {
        console.log(err)
        reply('server-side error')
      })
    }
  }
]

module.exports = routes;

