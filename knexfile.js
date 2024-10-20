// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',   
      user: 'root', 
      password: '', 
      database: 'colabflow' 
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations' // Pasta onde as migrations serão salvas
    },
    seeds: {
      directory: './seeds' // Opcional, se você for usar seeders
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host: 'staging-db-host',   // Host do servidor de staging (se diferente)
      user: 'staging_user', 
      password: 'staging_password', 
      database: 'staging_db_name'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: 'production-db-host',  // Host do servidor de produção
      user: 'prod_user',
      password: 'prod_password',
      database: 'prod_db_name'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }

};