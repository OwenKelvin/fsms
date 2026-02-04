'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    // Create exam_tag join table
    await queryInterface.createTable('exam_tag', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      examId: {
        field: 'exam_id',
        type: DataTypes.UUID,
        references: {
          model: 'exams',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      tagId: {
        field: 'tag_id',
        type: DataTypes.UUID,
        references: {
          model: 'tags',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
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
    await queryInterface.addIndex('exam_tag', ['id']);
    await queryInterface.addIndex('exam_tag', ['exam_id']);
    await queryInterface.addIndex('exam_tag', ['tag_id']);
  },

  down: async (queryInterface) => {
    // Drop the tables in reverse order
    await queryInterface.dropTable('exam_tag');
  },
};
