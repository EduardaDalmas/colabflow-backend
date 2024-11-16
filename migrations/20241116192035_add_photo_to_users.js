/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
      table.longtext('photo').nullable()
  });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function (knex) {
  return knex.schema.table('users', (table) => {
      table.dropColumn('photo');
  });
};
