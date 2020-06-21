export const DEFAULT_DB_OPTIONS = {
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    __dirname + '../entities/**/*.ts',
    `${process.env.BOT_ROOT_PATH || process.cwd()}/src/entities/**/*.ts`,
  ],
  migrations: [
    __dirname + '../../db/migrations/**/*.ts',
    `${process.env.BOT_ROOT_PATH || process.cwd()}/db/migrations/**/*.ts`,
  ],
};
