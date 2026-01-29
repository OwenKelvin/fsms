'use strict';

module.exports = {
  up: async (queryInterface) => {
    // Step 1: Update values in the permissions table
    await queryInterface.sequelize.query(`
      UPDATE permissions
      SET name = REPLACE(name, 'answer', 'choice')
      WHERE name IN (
        'create exam question answer',
        'update exam question answer',
        'delete exam question answer'
      );
    `);

    await queryInterface.renameColumn(
      'questions',
      'answer_type',
      'choice_type',
    );
    await queryInterface.renameColumn(
      'questions',
      'correct_answer_explanation',
      'correct_choice_explanation',
    );
    await queryInterface.renameTable('answers', 'choices');
    await queryInterface.renameColumn(
      'choices',
      'is_correct_answer',
      'is_correct_choice',
    );
  },

  down: async (queryInterface) => {
    // Step 1: Revert values in the permissions table
    await queryInterface.sequelize.query(`
      UPDATE permissions
      SET name = REPLACE(name, 'choice', 'answer')
      WHERE name IN (
        'create exam question choice',
        'update exam question choice',
        'delete exam question choice'
      );
    `);

    await queryInterface.renameColumn(
      'questions',
      'choice_type',
      'answer_type',
    );
    await queryInterface.renameColumn(
      'questions',
      'correct_choice_explanation',
      'correct_answer_explanation',
    );
    await queryInterface.renameTable('choices', 'answers');
    await queryInterface.renameColumn(
      'answers',
      'is_correct_choice',
      'is_correct_answer',
    );
  },
};
