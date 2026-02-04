'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('instructions', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      examPaperId: {
        field: 'exam_paper_id',
        type: DataTypes.UUID,
        references: {
          model: 'exam_papers',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.addIndex('instructions', ['id']);
    await queryInterface.addIndex('instructions', ['exam_paper_id']);
    await queryInterface.addIndex('instructions', ['created_by_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('instructions');
  },
};
