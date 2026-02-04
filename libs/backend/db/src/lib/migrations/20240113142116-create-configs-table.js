'use strict';

const { DataTypes, fn } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    // Create exams table
    await queryInterface.createTable('configs', {
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
      type: {
        type: DataTypes.ENUM('EXAM', 'EXAM_PAPER'),
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
    
    // Add index
    await queryInterface.addIndex('configs', ['id']);
    
    // Add unique constraint on combination of type and name
    await queryInterface.addConstraint('configs', {
      fields: ['type', 'name'],
      type: 'unique',
      name: 'unique_type_name_combination',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('configs');
  },
};
