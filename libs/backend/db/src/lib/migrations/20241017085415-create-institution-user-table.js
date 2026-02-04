'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    // Create exams table
    await queryInterface.createTable('institution_user', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      institutionId: {
        field: 'institution_id',
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'institutions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        field: 'user_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userRole: {
        field: 'user_role',
        type: DataTypes.ENUM('Owner', 'Administrator', 'Examiner'),
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
    await queryInterface.addIndex('institution_user', ['id']);
    await queryInterface.addIndex('institution_user', ['institution_id']);
    await queryInterface.addIndex('institution_user', ['user_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('institution_user');
  },
};
