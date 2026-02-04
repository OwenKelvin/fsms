'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('examinees', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      uniqueIdentifier: {
        unique: true,
        field: 'unique_identifier',
        type: DataTypes.STRING,
        allowNull: false,
      },
      otherDetails: {
        field: 'other_details',
        type: DataTypes.JSON,
      },
      createdById: {
        field: 'created_by_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Add indexes
    await queryInterface.addIndex('examinees', ['id']);
    await queryInterface.addIndex('examinees', ['created_by_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('examinees');
  },
};
