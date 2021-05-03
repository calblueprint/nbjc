import Base from 'db-migrate-base';

/**
 * Describe what your `up` migration does.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`, callback);
}

/**
 * Describe what your `down` migration does.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(`DROP EXTENSION IF EXISTS "uuid-ossp";`, callback);
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
