import Base from 'db-migrate-base';
import { promisify } from 'util';
/**
 * Describe what your `up` migration does.
 */
export function up(db: Base, callback: Base.CallbackFunction): void {
  db.runSql(
    `
      CREATE TABLE OrganizationApplications
        (
          id                   SERIAL,
          status               status NOT NULL,
          organization_id      INTEGER NOT NULL,
          question             VARCHAR(255) NOT NULL,
          PRIMARY KEY (id),
          FOREIGN KEY (organization_id) references organizations(id)
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
    await dropTable('OrganizationApplications');
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
