'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    // Create the 'otps' table
    await queryInterface.createTable('otps', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      identifier: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      validity: {
        type: DataTypes.INTEGER,
      },
      valid: {
        type: DataTypes.BOOLEAN,
      },
      usage: {
        type: DataTypes.STRING,
      },
      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        field: 'deleted_at',
        allowNull: true,
        type: DataTypes.DATE,
      },
    });

    // Add index
    await queryInterface.addIndex('otps', ['id']);
  },

  async down(queryInterface) {
    // Drop the 'otps' table
    await queryInterface.dropTable('otps');
  },
};
