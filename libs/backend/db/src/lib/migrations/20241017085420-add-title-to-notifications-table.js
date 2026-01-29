'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notifications', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Success',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('notifications', 'title');
  },
};
