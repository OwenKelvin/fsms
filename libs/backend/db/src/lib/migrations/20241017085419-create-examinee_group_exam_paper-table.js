'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('examinee_group_exam_paper', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      examineeGroupId: {
        field: 'examinee_group_id',
        type: DataTypes.INTEGER,
        references: {
          model: 'examinee_groups',
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('examinee_group_exam_paper');
  },
};
