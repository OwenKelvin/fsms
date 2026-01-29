'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.changeColumn('answers', 'description', {
      type: DataTypes.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.changeColumn('answers', 'description', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};
