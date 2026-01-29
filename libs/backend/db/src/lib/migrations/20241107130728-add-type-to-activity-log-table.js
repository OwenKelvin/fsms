const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('activity_logs', 'type', {
      type: DataTypes.ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS'),
      allowNull: false,
      defaultValue: 'INFO',
    });

    await queryInterface.changeColumn('activity_logs', 'type', {
      type: DataTypes.ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS'),
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('activity_logs', 'type');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_activity_logs_type";',
    ); // Removes ENUM type in Postgres
  },
};
