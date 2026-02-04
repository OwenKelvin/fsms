'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      const configObjects = [
        { type: 'EXAM', name: 'Allow copy pasting' },
        { type: 'EXAM', name: 'Shuffle Question' },
        { type: 'EXAM', name: 'Enable automatic submissions' },
        { type: 'EXAM', name: 'Allow partial submissions' },
        { type: 'EXAM', name: 'Enable immediate feedback' },

        { type: 'EXAM_PAPER', name: 'Allow copy pasting' },
        { type: 'EXAM_PAPER', name: 'Shuffle Question' },
        { type: 'EXAM_PAPER', name: 'Set exam time limit' },
        { type: 'EXAM_PAPER', name: 'Set question time limit' },
        { type: 'EXAM_PAPER', name: 'Enable automatic submissions' },
        { type: 'EXAM_PAPER', name: 'Allow partial submissions' },
        { type: 'EXAM_PAPER', name: 'Create different versions of the exam' },
        { type: 'EXAM_PAPER', name: 'Enable immediate feedback' },
        { type: 'EXAM_PAPER', name: 'Set passing score' },
      ].map((item) => {
        return {
          id: uuidv4(),
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });
      await queryInterface.bulkInsert('configs', configObjects, {});
    } catch (error) {
      // Handle the error here, you can log it or do any other necessary action
      console.error('Error while bulk inserting configs:', error);
    }
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('configs', null, {});
  },
};
