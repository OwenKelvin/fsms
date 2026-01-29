'use strict';

const { DataTypes } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    // Add institution_id with allowNull: true initially
    await queryInterface.addColumn('exams', 'institution_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('tags', 'institution_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('exam_papers', 'institution_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('examinee_groups', 'institution_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('examinees', 'institution_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'institutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Set existing rows to have institution_id = 1
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        'UPDATE exams SET institution_id = 1 WHERE institution_id IS NULL',
        { transaction },
      );
      await queryInterface.sequelize.query(
        'UPDATE tags SET institution_id = 1 WHERE institution_id IS NULL',
        { transaction },
      );
      await queryInterface.sequelize.query(
        'UPDATE exam_papers SET institution_id = 1 WHERE institution_id IS NULL',
        { transaction },
      );
      await queryInterface.sequelize.query(
        'UPDATE examinee_groups SET institution_id = 1 WHERE institution_id IS NULL',
        { transaction },
      );
      await queryInterface.sequelize.query(
        'UPDATE examinees SET institution_id = 1 WHERE institution_id IS NULL',
        { transaction },
      );
    });

    // Change institution_id to allowNull: false
    await queryInterface.changeColumn('exams', 'institution_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('exam_papers', 'institution_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('examinee_groups', 'institution_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('examinees', 'institution_id', {
      type: DataTypes.INTEGER,
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
