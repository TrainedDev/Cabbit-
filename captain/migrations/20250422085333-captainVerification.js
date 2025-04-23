'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Verifications", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      captainName: Sequelize.STRING,
      license_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      panCard_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      captainId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Captains",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Verifications");
  }
};
