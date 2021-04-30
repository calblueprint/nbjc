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
    ADD COLUMN  approved_seen       BOOLEAN             NOT NULL DEFAULT false;
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
    DROP COLUMN approved_seen;
  `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
