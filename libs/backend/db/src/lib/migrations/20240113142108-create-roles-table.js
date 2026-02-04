'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
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
    
    // Add index on permissions primary key
    await queryInterface.addIndex('permissions', ['id']);
    
    // Create roles table
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
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

    // Add index on roles primary key
    await queryInterface.addIndex('roles', ['id']);

    // Create permission_role join table
    await queryInterface.createTable('permission_role', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      role_id: {
        type: Sequelize.UUID,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      permission_id: {
        type: Sequelize.UUID,
        references: {
          model: 'permissions', // Assuming the permission table is named 'permissions'
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Add indexes on permission_role foreign keys
    await queryInterface.addIndex('permission_role', ['id']);
    await queryInterface.addIndex('permission_role', ['role_id']);
    await queryInterface.addIndex('permission_role', ['permission_id']);

    // Create role_user join table
    await queryInterface.createTable('role_user', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      role_id: {
        type: Sequelize.UUID,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users', // Assuming the user table is named 'users'
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Add indexes on role_user foreign keys
    await queryInterface.addIndex('role_user', ['id']);
    await queryInterface.addIndex('role_user', ['role_id']);
    await queryInterface.addIndex('role_user', ['user_id']);
  },

  down: async (queryInterface) => {
    // Drop tables in reverse order
    await queryInterface.dropTable('role_user');
    await queryInterface.dropTable('permission_role');
    await queryInterface.dropTable('roles');
    await queryInterface.dropTable('permissions');
  },
};
