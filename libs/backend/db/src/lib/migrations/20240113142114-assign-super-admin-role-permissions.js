'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    // Find the role ID of 'Super Admin'
    const superAdminRoleId = await queryInterface.rawSelect(
      'roles',
      {
        where: {
          name: 'Super Admin',
        },
      },
      ['id'],
    );

    if (!superAdminRoleId) {
      throw new Error("Role 'Super Admin' not found");
    }

    // Find all permission IDs
    const permissions = await queryInterface.sequelize.query(
      'SELECT id FROM permissions',
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (!permissions || permissions.length === 0) {
      throw new Error('No permissions found');
    }

    const permissionIds = permissions.map((permission) => permission.id);

    // Assign all permissions to the 'Super Admin' role
    const permissionRoleValues = permissionIds.map((permissionId) => ({
      id: uuidv4(),
      permission_id: permissionId,
      role_id: superAdminRoleId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    await queryInterface.bulkInsert('permission_role', permissionRoleValues);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permission_role', null, {});
  },
};
