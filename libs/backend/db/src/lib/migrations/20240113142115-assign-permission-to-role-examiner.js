'use strict';

const { Op, QueryTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const permissionsDeclarations = [
  "'create quote'",
  "'update quote'",
  "'delete quote'",
  "'create exam'",
  "'update exam'",
  "'delete exam'",
  "'create exam paper'",
  "'update exam paper'",
  "'delete exam paper'",
  "'create exam question'",
  "'delete exam question'",
  "'update exam question'",
  "'create exam question answer'",
  "'delete exam question answer'",
  "'update exam question answer'",
  "'create exam paper instruction'",
  "'update exam paper instruction'",
  "'delete exam paper instruction'",
  "'create examinee'",
  "'delete examinee'",
  "'update examinee'",
  "'create examinee group'",
  "'delete examinee group'",
  "'update examinee group'",
  "'mark notification as read'",
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Find the role ID of 'Examiner'
    const examinerRoleId = await queryInterface.rawSelect(
      'roles',
      {
        where: {
          name: 'Examiner',
        },
      },
      ['id'],
    );

    if (!examinerRoleId) {
      throw new Error("Role 'Examiner' not found");
    }

    // Find the permission IDs for 'create exam', 'update exam', and 'delete exam'
    const permissions = await queryInterface.sequelize.query(
      `SELECT id FROM permissions WHERE name IN (
        ${permissionsDeclarations.join(',')}
       )`,
      { type: QueryTypes.SELECT },
    );

    if (!permissions || permissions.length === 0) {
      throw new Error('Required permissions not found');
    }

    const permissionIds = permissions.map((permission) => permission.id);

    // Assign the selected permissions to the 'Examiner' role
    const permissionRoleValues = permissionIds.map((permissionId) => ({
      id: uuidv4(),
      permission_id: permissionId,
      role_id: examinerRoleId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    await queryInterface.bulkInsert('permission_role', permissionRoleValues);
  },

  async down(queryInterface) {
    // Remove the permissions assigned to the 'Examiner' role
    await queryInterface.bulkDelete('permission_role', {
      role_id: {
        [Op.eq]: await queryInterface.rawSelect(
          'roles',
          {
            where: {
              name: 'Examiner',
            },
          },
          ['id'],
        ),
      },
      permission_id: {
        [Op.in]: (
          await queryInterface.sequelize.query(
            `SELECT id FROM permissions WHERE name IN (
              ${permissionsDeclarations.join(',')}
          )`,
            { type: QueryTypes.SELECT },
          )
        ).map((permission) => permission.id),
      },
    });
  },
};
