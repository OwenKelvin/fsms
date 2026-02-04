'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_log_user', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      activityLogId: {
        field: 'activity_log_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'activity_logs', // name of the ActivityLog table in snake_case
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        field: 'user_id',
        type: Sequelize.UUID,
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
    await queryInterface.addIndex('activity_log_user', ['id']);
    await queryInterface.addIndex('activity_log_user', ['activity_log_id']);
    await queryInterface.addIndex('activity_log_user', ['user_id']);

    // Adding a unique constraint to ensure each user can only view a given activity once
    await queryInterface.addConstraint('activity_log_user', {
      fields: ['activity_log_id', 'user_id'],
      type: 'unique',
      name: 'unique_activity_log_user',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('activity_log_user');
  },
};
