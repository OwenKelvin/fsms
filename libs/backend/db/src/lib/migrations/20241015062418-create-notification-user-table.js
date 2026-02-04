'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('notification_user', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      notificationId: {
        field: 'notification_id',
        type: DataTypes.UUID,
        references: {
          model: 'notifications',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      userId: {
        field: 'user_id',
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      isRead: {
        field: 'is_read',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.addIndex('notification_user', ['id']);
    await queryInterface.addIndex('notification_user', ['notification_id']);
    await queryInterface.addIndex('notification_user', ['user_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('notification_user');
  },
};
