'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Add composite index for registration status and date range queries
    // This optimizes queries like: WHERE status = 'pending' AND created_at BETWEEN date1 AND date2
    await queryInterface.addIndex('registration_records', ['status', 'created_at'], {
      name: 'idx_registration_records_status_created_at',
    });

    // Add composite index for registration status and completion date queries
    // This optimizes queries like: WHERE status = 'approved' AND completed_at IS NOT NULL
    await queryInterface.addIndex('registration_records', ['status', 'completed_at'], {
      name: 'idx_registration_records_status_completed_at',
    });

    // Add index on created_at for date range queries
    await queryInterface.addIndex('registration_records', ['created_at'], {
      name: 'idx_registration_records_created_at',
    });

    // Add explicit indexes for email and username uniqueness checks on users table
    // These optimize lookups during registration validation
    // Note: UNIQUE constraints already exist, but explicit indexes can improve performance
    await queryInterface.addIndex('users', ['email'], {
      name: 'idx_users_email',
      unique: true,
    });

    await queryInterface.addIndex('users', ['username'], {
      name: 'idx_users_username',
      unique: true,
    });

    // Add composite index for institution-user relationship queries
    // This optimizes queries joining institutions with their admin users
    await queryInterface.addIndex('registration_records', ['institution_id', 'admin_user_id'], {
      name: 'idx_registration_records_institution_admin',
    });

    // Add composite index for document verification queries
    // This optimizes queries like: WHERE registration_id = X AND verification_status = 'pending'
    await queryInterface.addIndex('registration_documents', ['registration_id', 'verification_status'], {
      name: 'idx_registration_documents_reg_verification',
    });

    // Add composite index for document type and verification status queries
    // This optimizes queries like: WHERE document_type = 'accreditation_certificate' AND verification_status = 'pending'
    await queryInterface.addIndex('registration_documents', ['document_type', 'verification_status'], {
      name: 'idx_registration_documents_type_verification',
    });

    // Add index on registration_status_history for audit trail queries
    // This optimizes queries like: WHERE registration_id = X ORDER BY changed_at DESC
    await queryInterface.addIndex('registration_status_history', ['registration_id', 'changed_at'], {
      name: 'idx_registration_status_history_reg_changed',
    });

    // Add index for job title lookups during registration
    await queryInterface.addIndex('job_titles', ['title'], {
      name: 'idx_job_titles_title',
    });

    // Add index for active job titles
    await queryInterface.addIndex('job_titles', ['is_active'], {
      name: 'idx_job_titles_is_active',
    });
  },

  async down(queryInterface) {
    // Remove all indexes in reverse order
    await queryInterface.removeIndex('job_titles', 'idx_job_titles_is_active');
    await queryInterface.removeIndex('job_titles', 'idx_job_titles_title');
    await queryInterface.removeIndex('registration_status_history', 'idx_registration_status_history_reg_changed');
    await queryInterface.removeIndex('registration_documents', 'idx_registration_documents_type_verification');
    await queryInterface.removeIndex('registration_documents', 'idx_registration_documents_reg_verification');
    await queryInterface.removeIndex('registration_records', 'idx_registration_records_institution_admin');
    await queryInterface.removeIndex('users', 'idx_users_username');
    await queryInterface.removeIndex('users', 'idx_users_email');
    await queryInterface.removeIndex('registration_records', 'idx_registration_records_created_at');
    await queryInterface.removeIndex('registration_records', 'idx_registration_records_status_completed_at');
    await queryInterface.removeIndex('registration_records', 'idx_registration_records_status_created_at');
  },
};
