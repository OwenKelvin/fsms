'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('registration_documents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      documentType: {
        field: 'document_type',
        type: DataTypes.ENUM('accreditation_certificate', 'operating_license'),
        allowNull: false,
      },
      verificationStatus: {
        field: 'verification_status',
        type: DataTypes.ENUM(
          'pending',
          'approved',
          'rejected',
          'requires_resubmission',
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
      verifiedAt: {
        field: 'verified_at',
        type: DataTypes.DATE,
        allowNull: true,
      },
      verifiedBy: {
        field: 'verified_by',
        type: DataTypes.STRING,
        allowNull: true,
      },
      uploadedAt: {
        field: 'uploaded_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      fileUploadId: {
        field: 'file_upload_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'file_uploads',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.addIndex('registration_documents', ['id']);
    await queryInterface.addIndex('registration_documents', [
      'registration_id',
    ]);
    await queryInterface.addIndex('registration_documents', ['file_upload_id']);
    await queryInterface.addIndex('registration_documents', [
      'verification_status',
    ]);
    await queryInterface.addIndex('registration_documents', ['document_type']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('registration_documents');
  },
};
