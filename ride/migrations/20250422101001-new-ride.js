'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Ride", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      captainId: Sequelize.INTEGER,
      userId: Sequelize.INTEGER,
      pickUp: Sequelize.STRING,
      dropOf: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM('requested', 'accepted', 'started', 'completed'),
        defaultValue: "requested",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Ride")
  }
};
