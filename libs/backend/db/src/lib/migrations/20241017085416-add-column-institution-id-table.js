'use strict';

const { DataTypes } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    // Add institution_id with allowNull: true initially
    await queryInterface.addColumn('exams', 'institution_id', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('tags', 'institution_id', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('exam_papers', 'institution_id', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('examinee_groups', 'institution_id', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('examinees', 'institution_id', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Note: Since we're using UUIDs, we cannot set a default value of 1
    // The migration will need to be adjusted to handle existing data differently
    // For now, we'll skip the data migration step as this is a fresh UUID migration

    // Change institution_id to allowNull: false
    await queryInterface.changeColumn('exams', 'institution_id', {
      type: DataTypes.UUID,
      allowNull: false,
    });

    await queryInterface.changeColumn('exam_papers', 'institution_id', {
      type: DataTypes.UUID,
      allowNull: false,
    });

    await queryInterface.changeColumn('examinee_groups', 'institution_id', {
      type: DataTypes.UUID,
      allowNull: false,
    });

    await queryInterface.changeColumn('examinees', 'institution_id', {
      type: DataTypes.UUID,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('exams', 'institution_id');
    await queryInterface.removeColumn('tags', 'institution_id');
    await queryInterface.removeColumn('exam_papers', 'institution_id');
    await queryInterface.removeColumn('examinee_groups', 'institution_id');
    await queryInterface.removeColumn('examinees', 'institution_id');
  },
};
