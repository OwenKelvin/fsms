'use strict';

const { DataTypes, fn } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // To generate UUIDs for new records
const bcrypt = require('bcrypt'); // Correctly import bcrypt

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const currentTime = new Date();

      // 1. Create 'APP ADMIN' role
      const appAdminRoleId = uuidv4();
      await queryInterface.bulkInsert(
        'roles',
        [
          {
            id: appAdminRoleId,
            name: 'APP ADMIN',
            created_at: currentTime,
            updated_at: currentTime,
          },
        ],
        { transaction },
      );
      console.log("Added 'APP ADMIN' role.");

      // 2. Create default admin user
      const adminUserId = uuidv4();
      const email = 'admin@tahiniwa.com';
      const plainPassword = 'Password@123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password with a salt round of 10

      await queryInterface.bulkInsert(
        'users',
        [
          {
            id: adminUserId,
            email: email,
            username: `admin_${Math.random().toString(36).substring(2, 8)}`, // Generate a unique username
            password: hashedPassword,
            first_name: 'App',
            last_name: 'Admin',
            email_verified_at: currentTime,
            created_at: currentTime,
            updated_at: currentTime,
          },
        ],
        { transaction },
      );
      console.log(`Added default admin user: ${email}.`);

      // 3. Assign 'APP ADMIN' role to the default admin user
      await queryInterface.bulkInsert(
        'role_user',
        [
          {
            id: uuidv4(), // UUID for the join table entry
            role_id: appAdminRoleId,
            user_id: adminUserId,
            created_at: currentTime,
            updated_at: currentTime,
          },
        ],
        { transaction },
      );
      console.log(`Assigned 'APP ADMIN' role to ${email}.`);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error during migration (up):', error);
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const email = 'admin@tahiniwa.com';
      
      // Get the admin user ID
      const adminUser = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = '${email}' LIMIT 1;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      );
      const adminUserId = adminUser[0] ? adminUser[0].id : null;

      // Get the 'APP ADMIN' role ID
      const appAdminRole = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE name = 'APP ADMIN' LIMIT 1;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      );
      const appAdminRoleId = appAdminRole[0] ? appAdminRole[0].id : null;

      // Remove the user-role link
      if (adminUserId && appAdminRoleId) {
        await queryInterface.bulkDelete(
          'role_user',
          { user_id: adminUserId, role_id: appAdminRoleId },
          { transaction },
        );
        console.log(`Removed 'APP ADMIN' role from ${email}.`);
      }

      // Remove the default admin user
      if (adminUserId) {
        await queryInterface.bulkDelete(
          'users',
          { id: adminUserId },
          { transaction },
        );
        console.log(`Removed default admin user: ${email}.`);
      }

      // Remove 'APP ADMIN' role
      if (appAdminRoleId) {
        await queryInterface.bulkDelete(
          'roles',
          { id: appAdminRoleId },
          { transaction },
        );
        console.log("Removed 'APP ADMIN' role.");
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error during migration (down):', error);
      throw error;
    }
  },
};
