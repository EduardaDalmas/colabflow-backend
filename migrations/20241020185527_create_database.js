/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('users', (table) => {
        table.increments('id').unsigned().primary();
        table.string('name').nullable();
        table.string('email').notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('modificated_at').nullable();
      })
      .createTable('priorities', (table) => {
        table.increments('id').unsigned().primary();
        table.string('name').nullable();
        table.timestamp('modificated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('profiles', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('id_user').unsigned().notNullable()
          .references('id').inTable('users').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.string('description').nullable();
        table.timestamp('modificated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('groups', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('id_context').unsigned().notNullable()
          .references('id').inTable('profiles').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.integer('id_user').unsigned().notNullable()
          .references('id').inTable('users').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.integer('id_priority').unsigned().notNullable()
          .references('id').inTable('priorities').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.string('name').notNullable().unique();
        table.timestamp('modificated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('chats', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('id_user').unsigned().notNullable()
          .references('id').inTable('users').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.string('name').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('modificated_at').defaultTo(knex.fn.now());
        table.integer('id_priority').unsigned().notNullable()
          .references('id').inTable('priorities').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.integer('id_group').unsigned().notNullable()
          .references('id').inTable('groups').onDelete('NO ACTION').onUpdate('NO ACTION');
      })
      .createTable('messages', (table) => {
        table.increments('id').primary();
        table.integer('id_chat').unsigned().notNullable()
          .references('id').inTable('chats').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.integer('id_user').unsigned().defaultTo(0)
          .references('id').inTable('users').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.text('text').notNullable();
        table.timestamp('modificated_at').nullable().defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('important_links', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('id_chat').unsigned().notNullable()
          .references('id').inTable('chats').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.integer('id_user').unsigned().notNullable()
          .references('id').inTable('users').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.string('link').nullable();
        table.timestamp('modificated_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('user_chat', (table) => {
        table.increments('id').unsigned().primary();
        table.integer('id_user').unsigned().notNullable()
          .references('id').inTable('users').onDelete('CASCADE');
        table.integer('id_chat').unsigned().notNullable()
          .references('id').inTable('chats').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at').defaultTo(knex.fn.now());
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('user_chat')
      .dropTableIfExists('important_links')
      .dropTableIfExists('messages')
      .dropTableIfExists('chats')
      .dropTableIfExists('groups')
      .dropTableIfExists('profiles')
      .dropTableIfExists('priorities')
      .dropTableIfExists('users');
  };
  