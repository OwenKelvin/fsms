'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('registration_records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'profile_info_collected',
          'institution_details_collected',
          'documents_uploaded',
          'admin_credentials_set',
          'under_review',
          'approved',
          'rejected',
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
      profileInfoCompleted: {
        field: 'profile_info_completed',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      institutionDetailsCompleted: {
        field: 'institution_details_completed',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      documentsUploaded: {
        field: 'documents_uploaded',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      adminCredentialsCompleted: {
        field: 'admin_credentials_completed',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      completedAt: {
        field: 'completed_at',
        type: DataTypes.DATE,
        allowNull: true,
      },
      institutionId: {
        field: 'institution_id',
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'institutions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      adminUserId: {
        field: 'admin_user_id',
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    // Add indexes for common queries
    await queryInterface.addIndex('registration_records', ['status']);
    await queryInterface.addIndex('registration_records', ['institution_id']);
    await queryInterface.addIndex('registration_records', ['admin_user_id']);
    await queryInterface.addIndex('registration_records', ['completed_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('registration_records');
  },
};
