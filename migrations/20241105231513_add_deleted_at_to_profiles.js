exports.up = function(knex) {
    return knex.schema.table('profiles', function(table) {
      table.timestamp('deleted_at').nullable(); // Campo que permite valores nulos inicialmente
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('profiles', function(table) {
      table.dropColumn('deleted_at'); // Remove o campo ao reverter a migração
    });
  };
  