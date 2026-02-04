'use strict';

const { DataTypes } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('transactions', 'quote_id', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'quotes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    
    // Add index
    await queryInterface.addIndex('transactions', ['quote_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('transactions', ['quote_id']);
    await queryInterface.removeColumn('transactions', 'quote_id');
  },
};
