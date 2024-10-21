/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('otp', (table) => {
            table.increments('id').unsigned().primary();
            table.string('otp').notNullable();
            table.integer('id_user').unsigned().notNullable()
                .references('id').inTable('users').onDelete('NO ACTION').onUpdate('NO ACTION');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('deleted_at').nullable();
            table.timestamp('expires_at').nullable();
        })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('otp');
    };
