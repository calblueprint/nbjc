import Base from 'db-migrate-base';

/**
 * Describe what your `up` migration does.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organizations
      ADD COLUMN contact_phone VARCHAR(255),
      ADD COLUMN website VARCHAR(255),
      DROP COLUMN key_values;
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
  db.runSql(
    `
    ALTER TABLE organizations
      DROP COLUMN contact_phone,
      DROP COLUMN website,
      ADD COLUMN key_values TEXT;
    `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
