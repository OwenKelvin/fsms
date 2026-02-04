'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('registration_status_history', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      registrationId: {
        field: 'registration_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'registration_records',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      previousStatus: {
        field: 'previous_status',
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
        allowNull: true,
      },
      newStatus: {
        field: 'new_status',
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
      },
      changedAt: {
        field: 'changed_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      changedBy: {
        field: 'changed_by',
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    });

    // Add indexes for common queries
    await queryInterface.addIndex('registration_status_history', ['id']);
    await queryInterface.addIndex('registration_status_history', [
      'registration_id',
    ]);
    await queryInterface.addIndex('registration_status_history', [
      'changed_at',
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('registration_status_history');
  },
};
