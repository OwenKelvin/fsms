const { DataTypes, fn } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      institutionId: {
        field: 'institution_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'institutions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: DataTypes.ENUM('purchase', 'exam', 'promotion'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      balanceAfterTransaction: {
        field: 'balance_after_transaction',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
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

    // Add indexes
    await queryInterface.addIndex('transactions', ['id']);
    await queryInterface.addIndex('transactions', ['institution_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('transactions');
  },
};
