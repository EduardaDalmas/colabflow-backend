exports.up = function(knex) {
    return knex.schema.table('chats', function(table) {
      table.timestamp('deleted_at').nullable().defaultTo(null);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('chats', function(table) {
      table.dropColumn('deleted_at');
    });
  };
  