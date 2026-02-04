'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('examinee_group_exam_paper', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
      examineeGroupId: {
        field: 'examinee_group_id',
        type: DataTypes.UUID,
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

    // Add indexes
    await queryInterface.addIndex('examinee_group_exam_paper', ['id']);
    await queryInterface.addIndex('examinee_group_exam_paper', ['exam_paper_id']);
    await queryInterface.addIndex('examinee_group_exam_paper', ['examinee_group_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('examinee_group_exam_paper');
  },
};
