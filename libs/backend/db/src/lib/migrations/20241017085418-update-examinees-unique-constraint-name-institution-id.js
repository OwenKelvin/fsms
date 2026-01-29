'use strict';

module.exports = {
  up: async (queryInterface) => {
    // Remove the old unique constraint on 'unique_identifier'
    await queryInterface.removeConstraint(
      'examinees',
      'examinees_unique_identifier_key',
    );

    // Add the new composite unique constraint on 'unique_identifier' and 'institution_id'
    await queryInterface.addConstraint('examinees', {
      fields: ['unique_identifier', 'institution_id'],
      type: 'unique',
      name: 'examinees_unique_identifier_institution_id_unique', // custom name for the constraint
    });
  },

  down: async (queryInterface) => {
    // Remove the composite unique constraint on 'unique_identifier' and 'institution_id'
    await queryInterface.removeConstraint(
      'examinees',
      'examinees_unique_identifier_institution_id_unique',
    );

    // Re-add the unique constraint on 'unique_identifier' only
    await queryInterface.addConstraint('examinees', {
      fields: ['unique_identifier'],
      type: 'unique',
      name: 'examinees_unique_identifier_key',
    });
  },
};
