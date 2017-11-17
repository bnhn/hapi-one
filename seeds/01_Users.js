
exports.seed = function (knex, Promise) {

  var tableName = 'users';

  var rows = [

    // You are free to add as many rows as you feel like in this array. Make sure that they're an object containing the following fields:
    {
      name: 'Rayy Benhin',
      username: 'bnhn',
      password: 'password',
      email: 'me@isomr.co',
      guid: 'f03ede7c-b121-4112-bcc7-130a3e87988c',
    },

  ];
  // Deletes ALL existing entries
  return knex(tableName).del()
    .then(function () {
      // Inserts seed entries
      return knex(tableName).insert(rows);
    });
};
