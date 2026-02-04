'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    // Enable uuid-ossp extension for UUID support
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );

    // Create the 'users' table
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        field: 'first_name',
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        field: 'last_name',
        type: DataTypes.STRING,
        allowNull: false,
      },
      middleName: {
        field: 'middle_name',
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailVerifiedAt: {
        field: 'email_verified_at',
        allowNull: true,
        type: DataTypes.DATE,
      },
      phoneVerifiedAt: {
        field: 'phone_verified_at',
        allowNull: true,
        type: DataTypes.DATE,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      profilePhotoLink: {
        field: 'profile_photo_link',
        allowNull: true,
        type: DataTypes.STRING,
      },
      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        field: 'deleted_at',
        allowNull: true,
        type: DataTypes.DATE,
      },
    });

    // Add index on primary key
    await queryInterface.addIndex('users', ['id']);
  },

  async down(queryInterface) {
    // Drop the 'users' table
    await queryInterface.dropTable('users');
  },
};
