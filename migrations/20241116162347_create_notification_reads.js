/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('notification_reads', function(table) {
        table.increments('id').primary();
        table.integer('notification_id').unsigned().notNullable()
          .references('id').inTable('notifications')
          .onDelete('CASCADE');
        table.integer('user_id').unsigned().notNullable()
          .references('id').inTable('users')
          .onDelete('CASCADE');
          table.timestamp('read_at').defaultTo(null).nullable();
        table.unique(['notification_id', 'user_id'], 'user_notification_unique');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('notification_reads');

};
