'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('users', 'job_title_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'job_titles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add index for job title lookups
    await queryInterface.addIndex('users', ['job_title_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', ['job_title_id']);
    await queryInterface.removeColumn('users', 'job_title_id');
  },
};