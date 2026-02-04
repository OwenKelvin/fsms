'use strict';

const { DataTypes, fn } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // Create the settings table
    await queryInterface.createTable('settings', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: fn('NOW'),
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: fn('NOW'),
      },
      deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    // Add index
    await queryInterface.addIndex('settings', ['id']);

    await queryInterface.bulkInsert('settings', [
      {
        id: uuidv4(),
        name: 'INITIAL_FREE_CREDIT',
        value: '200',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'WELCOME_EMAIL_DELAY_IN_MILLISECONDS',
        value: '10000', // Adjust this value as needed
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    // Remove the INITIAL_FREE_CREDIT setting
    await queryInterface.bulkDelete(
      'settings',
      { name: 'INITIAL_FREE_CREDIT' },
      {},
    );

    // Drop the settings table
    await queryInterface.dropTable('settings');
  },
};
