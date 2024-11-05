/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.table('messages', async function(table) {
        // Define o campo 'text' com valor padrão null
        table.text('text').nullable().defaultTo(null).alter();
    });

    // Check if the 'message' column exists, and add it if it doesn't
    const hasMessageColumn = await knex.schema.hasColumn('messages', 'message');
    if (!hasMessageColumn) {
        await knex.schema.table('messages', function(table) {
            table.text('message').nullable();
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.table('messages', function(table) {
        // Remove o campo 'message' se a migration for revertida
        table.dropColumn('message');
        
        // Optional: revert the 'text' column to a previous state if needed
        // Example: table.string('text').notNullable().alter();
    });
};