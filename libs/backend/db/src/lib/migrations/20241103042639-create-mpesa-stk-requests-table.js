'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    // Create the 'otps' table
    await queryInterface.createTable('mpesa_stk_requests', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      institutionId: {
        field: 'institution_id',
        type: DataTypes.UUID,
        references: {
          model: 'institutions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },

      quoteId: {
        field: 'quote_id',
        type: DataTypes.UUID,
        references: {
          model: 'quotes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },

      merchantRequestId: {
        field: 'merchant_request_id',
        allowNull: false,
        type: DataTypes.STRING,
      },

      checkoutRequestId: {
        field: 'checkout_request_id',
        allowNull: false,
        type: DataTypes.STRING,
      },

      responseCode: {
        field: 'response_code',
        allowNull: false,
        type: DataTypes.STRING,
      },

      responseDescription: {
        field: 'response_description',
        allowNull: false,
        type: DataTypes.STRING,
      },

      customerMessage: {
        field: 'customer_message',
        allowNull: false,
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

    // Add indexes
    await queryInterface.addIndex('mpesa_stk_requests', ['id']);
    await queryInterface.addIndex('mpesa_stk_requests', ['institution_id']);
    await queryInterface.addIndex('mpesa_stk_requests', ['quote_id']);
  },

  async down(queryInterface) {
    // Drop the 'otps' table
    await queryInterface.dropTable('mpesa_stk_requests');
  },
};
