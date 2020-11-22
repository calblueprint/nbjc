import Base from 'db-migrate-base';

/**
 * Adds a 1-1 connection from Users to Organizations.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE users
    ADD COLUMN organization_id INTEGER,
    ADD FOREIGN KEY (organization_id)
    REFERENCES organizations(id);
  `,
    callback
  );
}

/**
 * Removes connection between Users and Organizations.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE users
    DROP COLUMN organization_id;
  `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
