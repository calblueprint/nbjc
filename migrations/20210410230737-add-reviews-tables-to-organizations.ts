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
    `
    CREATE TABLE organization_application_reviews
      (
        id                           SERIAL,
        reason                       TEXT,
        created_at                   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        organization_id              INTEGER NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (organization_id)
          REFERENCES organizations(id)
      );
  `,
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
    await dropTable('organization_application_reviews');
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
