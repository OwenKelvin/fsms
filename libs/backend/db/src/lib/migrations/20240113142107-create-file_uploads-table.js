'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    // Create file_uploads table
    await queryInterface.createTable('file_uploads', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      encoding: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      mimetype: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      originalName: {
        field: 'original_name',
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
    await queryInterface.addIndex('file_uploads', ['id']);
  },

  down: async (queryInterface) => {
    // Drop file_uploads table
    await queryInterface.dropTable('file_uploads');
  },
};
