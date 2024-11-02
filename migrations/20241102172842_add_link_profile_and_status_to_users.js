/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('users', (table) => {
        table.string('link_profile').nullable(); // Coluna link_profile iniciando como nulo
        table.string('status').nullable(); // Coluna status iniciando como nulo
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('users', (table) => {
        table.dropColumn('link_profile'); // Remove a coluna link_profile
        table.dropColumn('status'); // Remove a coluna status
    });
};