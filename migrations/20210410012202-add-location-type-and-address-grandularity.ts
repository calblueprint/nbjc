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
    CREATE TYPE location_type AS ENUM ('Headquarters', 'Branch');
    ALTER TABLE organizations
      DROP COLUMN address,
      ADD COLUMN street VARCHAR(255),
      ADD COLUMN city VARCHAR(255),
      ADD COLUMN state VARCHAR(255),
      ADD COLUMN zip_code VARCHAR(255),
      ADD COLUMN location_type location_type;
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
    DROP TYPE location_type;
    ALTER TABLE organizations
      ADD COLUMN address VARCHAR(255),
      DROP COLUMN street,
      DROP COLUMN city,
      DROP COLUMN state
      DROP COLUMN zip_code
      DROP COLUMN location_type;
    `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
