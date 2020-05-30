'use strict';

const users = [
  {
    name: 'wn',
    email: 'wn@example.com',
    password: '123'
  },
  {
    name: 'dida',
    email: 'dida@example.com',
    password: '123'
  },
  {
    name: 'neto',
    email: 'neto@example.com',
    password: '123'
  },
  {
    name: 'wacn',
    email: 'wacn@example.com',
    password: '123'
  },
  {
    name: 'vera',
    email: 'vera@example.com',
    password: '123'
  },
  {
    name: 'dede',
    email: 'dede@example.com',
    password: '123'
  }
]



module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return Promise.all([
      users.forEach(ele => {
        queryInterface.bulkInsert('Users', [{
          name: ele.name,
          email: ele.email,
          password: ele.password,
          createdAt: new Date(),
          updatedAt: new Date()
        }], {});
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
