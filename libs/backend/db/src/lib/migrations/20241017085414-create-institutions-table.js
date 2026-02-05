'use strict';

const { DataTypes, fn } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('institutions', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      legal_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      institution_type: {
        type: DataTypes.ENUM(
          'ECDE',
          'PRIMARY_SCHOOL',
          'JUNIOR_SECONDARY',
          'SENIOR_SECONDARY',
          'TVET',
          'TEACHER_TRAINING_COLLEGE',
          'TECHNICAL_COLLEGE',
          'NATIONAL_POLYTECHNIC',
          'UNIVERSITY',
          'SPECIAL_NEEDS_SCHOOL',
          'ADULT_EDUCATION_CENTER',
        ),
        allowNull: true,
      },

      accreditation_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      street_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      state_province: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      zip_postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      official_website: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      created_by_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: fn('NOW'),
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: fn('NOW'),
      },

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    // Indexes
    await queryInterface.addIndex('institutions', ['id']);
    await queryInterface.addIndex('institutions', ['created_by_id']);
    await queryInterface.addIndex('institutions', ['institution_type']);
    await queryInterface.addIndex('institutions', ['accreditation_number']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('institutions');

    // Drop ENUM explicitly for Postgres
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_institutions_institution_type";',
    );
  },
};
