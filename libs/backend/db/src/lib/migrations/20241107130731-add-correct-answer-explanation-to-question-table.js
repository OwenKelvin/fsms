const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('questions', 'correct_answer_explanation', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'questions',
      'correct_answer_explanation',
    );
  },
};
