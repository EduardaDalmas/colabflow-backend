/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.table('messages', function(table) {
        // Define o campo 'text' com valor padrão null
        table.text('text').nullable().defaultTo(null).alter();

        // Cria o campo 'message' se não existir
        if (!table.hasColumn('message')) {
            table.text('message').nullable();
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.table('messages', function(table) {
        // Remove o campo 'message' se a migration for revertida
        table.dropColumn('message');
        
        // Para o campo 'text', se necessário, você pode reverter para um estado anterior, se aplicável
        // Exemplo: table.string('text').notNullable().alter();
    });
};