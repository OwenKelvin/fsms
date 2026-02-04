'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert(
        'roles',
        [
          {
            name: 'Super Admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            name: 'Admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            name: 'Examiner',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
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
