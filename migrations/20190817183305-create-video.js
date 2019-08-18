'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('videos', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: 'VARCHAR(50)'
      },
      title: {
        type: 'VARCHAR(100)'
      },
      date: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('videos');
  }
};