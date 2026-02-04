'use strict';

const { DataTypes, fn } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    // Create 'plan-infos' table
    await queryInterface.createTable('plan_infos', {
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
      planId: {
        field: 'plan_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'plans',
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
    await queryInterface.addIndex('plan_infos', ['id']);
    await queryInterface.addIndex('plan_infos', ['plan_id']);

    // Retrieve the ID of the plan by name
    const [plan] = await queryInterface.sequelize.query(
      `SELECT id FROM plans WHERE name = 'Alpha Plan' LIMIT 1;`,
    );
    const planId = plan[0]?.id;

    if (planId) {
      // Inserting sample data into 'plan-infos'
      await queryInterface.bulkInsert('plan_infos', [
        {
          id: uuidv4(),
          description: 'Free access to archived exams',
          plan_id: planId,
          created_at: fn('NOW'),
          updated_at: fn('NOW'),
        },
        {
          id: uuidv4(),
          description: 'Free creating of exams',
          plan_id: planId,
          created_at: fn('NOW'),
          updated_at: fn('NOW'),
        },
        {
          id: uuidv4(),
          description: '5 credits per exam paper taken',
          plan_id: planId,
          created_at: fn('NOW'),
          updated_at: fn('NOW'),
        },
        {
          id: uuidv4(),
          description: 'Each exam costs 5 credits to take',
          plan_id: planId,
          created_at: fn('NOW'),
          updated_at: fn('NOW'),
        },
      ]);
    } else {
      throw new Error(
        "Plan 'Alpha Plan' not found. Make sure the plan exists before running this migration.",
      );
    }
  },

  down: async (queryInterface) => {
    // Drop 'plan-infos' table
    await queryInterface.dropTable('plan_infos');
  },
};
