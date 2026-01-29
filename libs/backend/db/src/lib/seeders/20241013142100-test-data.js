const { hash } = require('bcrypt');
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Hash password
      const hashedPassword = await hash('pass', 10);

      // Create user
      const [user] = await queryInterface.bulkInsert(
        'users',
        [
          {
            username: 'testingaccount1@example.com',
            email: 'testingaccount1@example.com',
            first_name: 'testing',
            last_name: 'account1',
            email_verified_at: new Date(),
            password: hashedPassword,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { returning: true },
      );

      // Get role ID for 'Examiner'
      const [role] = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE name = 'Examiner' LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      );

      // Insert into role_user
      await queryInterface.bulkInsert('role_user', [
        {
          user_id: user.id,
          role_id: role.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      // Create random institution
      const [institution] = await queryInterface.bulkInsert(
        'institutions',
        [
          {
            name: faker.company.name(),
            created_by_id: user.id,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { returning: true },
      );

      // Assign institution to user
      await queryInterface.bulkInsert('institution_user', [
        {
          user_id: user.id,
          institution_id: institution.id,
          user_role: 'Owner',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      // Seed 60 tags
      let tags = [];
      for (let i = 0; i < 60; i++) {
        tags.push(faker.word.noun());
      }
      tags = [...new Set(tags)];
      await queryInterface.bulkInsert(
        'tags',
        tags.map((name) => ({
          name,
          institution_id: institution.id,
          created_by_id: user.id,
          created_at: new Date(),
          updated_at: new Date(),
        })),
      );

      // Create 10 examinee groups
      const examineeGroups = [];
      for (let i = 0; i < 10; i++) {
        examineeGroups.push({
          name: `Group ${i + 1}`,
          institution_id: institution.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      const insertedGroups = await queryInterface.bulkInsert(
        'examinee_groups',
        examineeGroups,
        {
          returning: true,
        },
      );

      // Create examinees and assign them to groups
      const examinees = [];
      const examineeGroupMappings = [];

      for (let i = 0; i < insertedGroups.length; i++) {
        const examineeCount = Math.floor(Math.random() * 21) + 50; // Between 50 and 70 examinees per group
        for (let j = 0; j < examineeCount; j++) {
          const examinee = {
            unique_identifier: faker.string.uuid(),
            institution_id: institution.id,
            created_at: new Date(),
            updated_at: new Date(),
          };
          examinees.push(examinee);
        }
      }
      const insertedExaminees = await queryInterface.bulkInsert(
        'examinees',
        examinees,
        {
          returning: true,
        },
      );

      // Add examinees to examinee groups
      for (let i = 0; i < insertedGroups.length; i++) {
        const examineeCount = Math.floor(Math.random() * 21) + 50; // Between 50 and 70 examinees per group
        for (let j = 0; j < examineeCount; j++) {
          const randomExaminee =
            insertedExaminees[
              Math.floor(Math.random() * insertedExaminees.length)
            ];
          examineeGroupMappings.push({
            examinee_id: randomExaminee.id,
            examinee_group_id: insertedGroups[i].id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
      await queryInterface.bulkInsert(
        'examinee_examinee_group',
        examineeGroupMappings,
      );

      // Create 5 exams
      const exams = [];
      for (let i = 0; i < 50; i++) {
        exams.push({
          name: `Exam ${i + 1}`,
          created_by_id: user.id,
          institution_id: institution.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      await queryInterface.bulkInsert('exams', exams);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    // Add commands to revert the migration
    await queryInterface.bulkDelete('exams', null, {});
    await queryInterface.bulkDelete('examinee_examinee_group', null, {});
    await queryInterface.bulkDelete('examinees', null, {});
    await queryInterface.bulkDelete('examinee_groups', null, {});
    await queryInterface.bulkDelete('institution_user', null, {});
    await queryInterface.bulkDelete('institutions', null, {});
    await queryInterface.bulkDelete('role_user', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('tags', null, {});
  },
};
