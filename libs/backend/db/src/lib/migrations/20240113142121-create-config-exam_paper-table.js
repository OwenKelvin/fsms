'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    // Create exams table
    await queryInterface.createTable('config_exam_paper', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      configId: {
        field: 'config_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'configs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      examPaperId: {
        field: 'exam_paper_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'exam_papers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      selected: {
        field: 'selected',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      value: {
        field: 'value',
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

    // Add indexes
    await queryInterface.addIndex('config_exam_paper', ['id']);
    await queryInterface.addIndex('config_exam_paper', ['config_id']);
    await queryInterface.addIndex('config_exam_paper', ['exam_paper_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('config_exam_paper');
  },
};
