'use strict';

const { DataTypes, fn } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('quotes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      institutionId: {
        field: 'institution_id',
        type: DataTypes.INTEGER,
        references: {
          model: 'institutions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      planId: {
        field: 'plan_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'plans',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      expireAt: {
        field: 'expire_at',
        type: DataTypes.DATE,
        allowNull: true,
      },
      totalCost: {
        field: 'total_cost',
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
      },
      creditAmount: {
        field: 'credit_amount',
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      creditCost: {
        field: 'credit_cost',
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 3],
        },
      },
      feeCost: {
        field: 'fee_cost',
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      taxCost: {
        field: 'tax_cost',
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      purchasedAt: {
        field: 'purchased_at',
        type: DataTypes.FLOAT,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('quotes');
  },
};
