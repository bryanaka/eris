/* File Path Definition */

// Eris Framework Path definition
const ERIS_ROOT_PATH = `${__dirname}..`;
const ERIS_SRC_PATH = `${ERIS_ROOT_PATH}/src`;
const ERIS_CONFIG_PATH = `${ERIS_ROOT_PATH}/config`;
const ERIS_DB_PATH = `${ERIS_ROOT_PATH}/db`;

export const ERIS_PATHS = {
  Root: ERIS_ROOT_PATH,
  Source: ERIS_SRC_PATH,
  Config: ERIS_CONFIG_PATH,
  DB: ERIS_DB_PATH,
};

// Consuming Bot App Path definition
const BOT_ROOT_PATH = process.env.BOT_ROOT_PATH || process.cwd();
const BOT_SRC_PATH = `${BOT_ROOT_PATH}/src`;
const BOT_CONFIG_PATH = `${BOT_ROOT_PATH}/config`;
const BOT_DB_PATH = `${BOT_ROOT_PATH}/db`;

export const BOT_PATHS = {
  Root: BOT_ROOT_PATH,
  Source: BOT_SRC_PATH,
  Config: BOT_CONFIG_PATH,
  DB: BOT_DB_PATH,
};
