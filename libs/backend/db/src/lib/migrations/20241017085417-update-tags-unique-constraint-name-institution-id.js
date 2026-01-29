'use strict';

module.exports = {
  up: async (queryInterface) => {
    // Remove the old unique constraint on 'name'
    await queryInterface.removeConstraint('tags', 'tags_name_key');

    // Add the new composite unique constraint on 'name' and 'institution_id'
    await queryInterface.addConstraint('tags', {
      fields: ['name', 'institution_id'],
      type: 'unique',
      name: 'tags_name_institution_id_unique', // custom name for the constraint
    });
  },

  down: async (queryInterface) => {
    // Remove the composite unique constraint on 'name' and 'institution_id'
    await queryInterface.removeConstraint(
      'tags',
      'tags_name_institution_id_unique',
    );

    // Re-add the unique constraint on 'name' only
    await queryInterface.addConstraint('tags', {
      fields: ['name'],
      type: 'unique',
      name: 'tags_name_key',
    });
  },
};
