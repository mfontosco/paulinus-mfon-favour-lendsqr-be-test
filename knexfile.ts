
import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

const config: Record<string, Knex.Config> = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'lendsqr_wallet',
    },
    migrations: {
      directory: './migrations', 
      extension: 'ts',
    },
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
    migrations: {
     directory: './migrations',
      extension: 'ts',
    },
  },
};

export default config;
