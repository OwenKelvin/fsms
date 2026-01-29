'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('plans', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tagLine: {
        field: 'tag_line',
        type: DataTypes.STRING,
        allowNull: false,
      },
      costPerCreditInKES: {
        field: 'cost_per_credit_in_kes',
        type: DataTypes.DOUBLE,
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
    await queryInterface.bulkInsert('plans', [
      {
        name: 'Alpha Plan',
        tag_line: 'General purpose plan for everyone',
        cost_per_credit_in_kes: 2.5,
        created_at: fn('NOW'),
        updated_at: fn('NOW'),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('plans');
  },
};
