'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('exam_papers', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      examId: {
        field: 'exam_id',
        type: DataTypes.UUID,
        references: {
          model: 'exams',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: true,
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
      paperDate: {
        field: 'paper_date',
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
    await queryInterface.addIndex('exam_papers', ['id']);
    await queryInterface.addIndex('exam_papers', ['exam_id']);
    await queryInterface.addIndex('exam_papers', ['created_by_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('exam_papers');
  },
};
