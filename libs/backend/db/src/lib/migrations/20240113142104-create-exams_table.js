'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    // Create exams table
    await queryInterface.createTable('exams', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        field: 'start_date',
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        field: 'end_date',
        type: DataTypes.DATE,
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

    // Add indexes
    await queryInterface.addIndex('exams', ['id']);
    await queryInterface.addIndex('exams', ['created_by_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('exams');
  },
};
