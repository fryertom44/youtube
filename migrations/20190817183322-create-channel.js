'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('channels', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: 'VARCHAR(50)'
      },
      channel_name: {
        type: 'VARCHAR(45)'
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('channels');
  }
};