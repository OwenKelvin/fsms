'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert(
        'roles',
        [
          {
            id: uuidv4(),
            name: 'Super Admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: uuidv4(),
            name: 'Admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: uuidv4(),
            name: 'Examiner',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: uuidv4(),
            name: 'Examinee',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        {},
      );
    } catch (error) {
      // Handle the error here, you can log it or do any other necessary action
      console.error('Error while bulk inserting roles:', error);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
