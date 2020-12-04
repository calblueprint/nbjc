import Base from 'db-migrate-base';
import { promisify } from 'util';

/**
 * Create the Application Notes table for Mod Dash notes on an organization
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    CREATE TABLE application_notes
      (
        id                           SERIAL,
        note                         TEXT,
        created_at                   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at                   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        organization_id              INTEGER NOT NULL,
        UNIQUE (organization_id),
        PRIMARY KEY (id),
        FOREIGN KEY (organization_id)
          REFERENCES organizations(id)
      );
  `,
    callback
  );
}

/**
 * Drop the Application Notes table
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const dropTable = promisify<string>(db.dropTable.bind(db));
  try {
    await dropTable('application_notes');
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
