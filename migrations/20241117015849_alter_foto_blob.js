/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('users', (table) => {
      table.longblob('photo').nullable().alter(); // Altera o tipo para longblob e garante que não tenha colação
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.table('users', (table) => {
      table.longtext('photo').nullable().alter(); // Restaura para longtext
    });
  };  