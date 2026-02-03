'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Add comprehensive institution fields
    await queryInterface.addColumn('institutions', 'legal_name', {
      type: DataTypes.STRING,
      allowNull: true, // Initially nullable for existing records
    });

    await queryInterface.addColumn('institutions', 'institution_type', {
      type: DataTypes.ENUM('educational', 'healthcare', 'corporate', 'government', 'non_profit'),
      allowNull: true, // Initially nullable for existing records
    });

    await queryInterface.addColumn('institutions', 'accreditation_number', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    // Add address fields
    await queryInterface.addColumn('institutions', 'street_address', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('institutions', 'city', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('institutions', 'state_province', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('institutions', 'zip_postal_code', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    // Add official website field
    await queryInterface.addColumn('institutions', 'official_website', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    // Add indexes for common queries
    await queryInterface.addIndex('institutions', ['institution_type']);
    await queryInterface.addIndex('institutions', ['accreditation_number']);
  },

  async down(queryInterface) {
    // Remove indexes
    await queryInterface.removeIndex('institutions', ['institution_type']);
    await queryInterface.removeIndex('institutions', ['accreditation_number']);

    // Remove columns
    await queryInterface.removeColumn('institutions', 'legal_name');
    await queryInterface.removeColumn('institutions', 'institution_type');
    await queryInterface.removeColumn('institutions', 'accreditation_number');
    await queryInterface.removeColumn('institutions', 'street_address');
    await queryInterface.removeColumn('institutions', 'city');
    await queryInterface.removeColumn('institutions', 'state_province');
    await queryInterface.removeColumn('institutions', 'zip_postal_code');
    await queryInterface.removeColumn('institutions', 'official_website');
  },
};