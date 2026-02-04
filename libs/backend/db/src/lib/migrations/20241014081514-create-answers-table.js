'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('answers', {
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
      isCorrectAnswer: {
        field: 'is_correct_answer',
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
    await queryInterface.addIndex('answers', ['id']);
    await queryInterface.addIndex('answers', ['question_id']);
    await queryInterface.addIndex('answers', ['created_by_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('answers');
  },
};
