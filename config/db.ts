import { ERIS_PATHS, BOT_PATHS } from 'eris/config/eris';

export const DEFAULT_DB_OPTIONS = {
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${ERIS_PATHS.Source}/entities/**/*.ts`, `${BOT_PATHS.Source}/entities/**/*.ts`],
  subscribers: [
    `${ERIS_PATHS.Source}/entities/subscribers/**/*.ts`,
    `${BOT_PATHS.Source}/entities/subscribers/**/*.ts`,
  ],
  migrations: [`${ERIS_PATHS.DB}/migrations/**/*.ts`, `${BOT_PATHS.DB}/migrations/**/*.ts`],
};
