'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FetchUrlExecutions', {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      fetchUrlJobId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      error: {
        type: Sequelize.DataTypes.TEXT,
      },
      html: {
        type: Sequelize.DataTypes.TEXT,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
      },
    });

    queryInterface.addIndex('FetchUrlExecutions', ['status', 'updatedAt'])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FetchUrlExecutions');
  }
};
