'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("uber_users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: Sequelize.STRING,
      password: Sequelize.STRING,
      email: Sequelize.STRING,
      phoneNumber: Sequelize.STRING,
      oauth_id: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("uber_users")
  }
};
