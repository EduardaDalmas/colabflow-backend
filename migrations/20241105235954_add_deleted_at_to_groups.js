exports.up = function(knex) {
    return knex.schema.table('groups', function(table) {
      table.timestamp('deleted_at').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('groups', function(table) {
      table.dropColumn('deleted_at');
    });
  };
  