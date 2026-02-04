'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    // Create exam_tag join table
    await queryInterface.createTable('question_tag', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      questionId: {
        field: 'question_id',
        type: DataTypes.UUID,
        references: {
          model: 'questions',
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
    await queryInterface.addIndex('question_tag', ['id']);
    await queryInterface.addIndex('question_tag', ['question_id']);
    await queryInterface.addIndex('question_tag', ['tag_id']);
  },

  down: async (queryInterface) => {
    // Drop the tables in reverse order
    await queryInterface.dropTable('question_tag');
  },
};
