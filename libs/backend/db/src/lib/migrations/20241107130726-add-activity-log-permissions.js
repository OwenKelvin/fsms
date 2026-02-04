'use strict';

const { v4: uuidv4 } = require('uuid');

const permissionItems = [
  {
    id: uuidv4(),
    name: 'create activity log',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    name: 'update activity log',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    name: 'delete activity log',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert('permissions', permissionItems, {});
    } catch (error) {
      console.error('Error while bulk inserting permissions:', error);
    }
  },
  async down(queryInterface) {
    try {
      await queryInterface.bulkDelete(
        'permissions',
        {
          name: permissionItems.map((item) => item.name),
        },
        {},
      );
    } catch (error) {
      console.error('Error while bulk deleting permissions:', error);
    }
  },
};
