import Base from 'db-migrate-base';
import { promisify } from 'util';

/**
 * Create the organization projects table.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    CREATE TABLE organization_projects
      (
        id                           SERIAL,
        title                        TEXT NOT NULL,
        description                  TEXT NOT NULL,
        organization_id              INTEGER NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (organization_id)
          REFERENCES organizations(id)
      );
  `,
    callback
  );
  // write migration up here
}

/**
 * Drops the organization projects table.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const dropTable = promisify<string>(db.dropTable.bind(db));
  try {
    await dropTable('organization_projects');
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
