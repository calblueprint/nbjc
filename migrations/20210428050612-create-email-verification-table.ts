import Base from 'db-migrate-base';
import { promisify } from 'util';

/**
 * Describe what your `up` migration does.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `CREATE TABLE email_verifications
    (
      id            uuid DEFAULT uuid_generate_v4(),
      user_id       INTEGER NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      valid         BOOLEAN NOT NULL DEFAULT TRUE,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`,
    callback
  );
}

/**
 * Describe what your `down` migration does.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const dropTable = promisify<string>(db.dropTable.bind(db));
  try {
    await dropTable('email_verifications');
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
