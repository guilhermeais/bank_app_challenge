'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('accounts',  {
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('accounts')
  }
};
