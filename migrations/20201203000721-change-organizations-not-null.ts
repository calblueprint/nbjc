import Base from 'db-migrate-base';

/**
 * Make all columns of Organizations table nullable
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organizations
      ALTER COLUMN name DROP NOT NULL,
      ALTER COLUMN contact_name DROP NOT NULL,
      ALTER COLUMN contact_email DROP NOT NULL,
      ALTER COLUMN ein SET DATA TYPE VARCHAR(255);
    `,
    callback
  );
}

/**
 * Revert name, contactName, and contactEmail columns to be NOT NULL
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organizations
      ALTER COLUMN name SET NOT NULL,
      ALTER COLUMN contact_name SET NOT NULL,
      ALTER COLUMN contact_email SET NOT NULL,
      ALTER COLUMN ein TYPE INTEGER USING ein::integer;
    `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
