'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      const items = [
        'role',
        'permission',
        'user',
        'tag',
        'exam',
        'otp',
        'password-reset',
        'config',
        'exam paper',
        'exam question',
        'exam question answer',
        'exam paper instruction',
        'notification',
        'examinee group',
        'examinee',
        'institution',
        'setting',
        'credit',
        'transaction',
        'plan',
        'plan info',
        'quote',
        'payment',
      ];
      let permissionObjects = [
        ...items.flatMap((item) =>
          item ? [`delete ${item}`, `update ${item}`, `create ${item}`] : [],
        ),
        'give permission to role',
        'assign role to user',
        'mark notification as read',
      ].map((name) => {
        return {
          id: uuidv4(),
          name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });
      await queryInterface.bulkInsert('permissions', permissionObjects, {});
    } catch (error) {
      // Handle the error here, you can log it or do any other necessary action
      console.error('Error while bulk inserting permissions:', error);
    }
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
