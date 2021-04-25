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
    CREATE TABLE org_team_members
      (
        id                SERIAL, 
        name              VARCHAR(255) NOT NULL,
        title             VARCHAR(255) NOT NULL,
        organization_id   INTEGER NOT NULL,
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
    await dropTable('org_team_members');
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
