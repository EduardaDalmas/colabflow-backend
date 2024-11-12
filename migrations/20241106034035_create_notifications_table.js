const { authPlugins } = require("mysql2");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('notifications');
  if (!exists) {
    return knex.schema.createTable('notifications', (table) => {
      table.increments('id').primary(); // ID da notificação
      table.integer('message_id').unsigned().notNullable();
      table.integer('chat_id').unsigned().notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Data e hora da notificação
      table.enu('status', ['NOVA', 'LIDA']).defaultTo('NOVA'); // Status inicial da notificação
      table.boolean('email').defaultTo(false); // Indica se o e-mail foi enviado
      
      // Definição das chaves estrangeiras
      table.foreign('message_id').references('id').inTable('messages').onDelete('CASCADE');
      table.foreign('chat_id').references('id').inTable('chats').onDelete('CASCADE');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('notifications');
};
