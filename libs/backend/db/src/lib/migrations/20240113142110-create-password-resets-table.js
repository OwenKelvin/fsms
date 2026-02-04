const { DataTypes } = require('sequelize');
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('password_resets', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        field: 'user_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        field: 'expires_at',
        type: DataTypes.DATE,
        allowNull: false,
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
    await queryInterface.addIndex('password_resets', ['id']);
    await queryInterface.addIndex('password_resets', ['user_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('password_resets');
  },
};
