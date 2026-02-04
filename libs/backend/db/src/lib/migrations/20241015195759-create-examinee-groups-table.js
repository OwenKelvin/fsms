'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('examinee_groups', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    await queryInterface.addIndex('examinee_groups', ['id']);
    await queryInterface.addIndex('examinee_groups', ['created_by_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('examinee_groups');
  },
};
