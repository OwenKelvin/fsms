'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('questions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      answerType: {
        field: 'answer_type',
        type: DataTypes.ENUM('CheckBox', 'Radio', 'Input'),
        allowNull: false,
      },
      autoMark: {
        field: 'auto_mark',
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      examPaperId: {
        field: 'exam_paper_id',
        type: DataTypes.INTEGER,
        references: {
          model: 'exam_papers',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      createdById: {
        field: 'created_by_id',
        type: DataTypes.INTEGER,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('questions');
  },
};
