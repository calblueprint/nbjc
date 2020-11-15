import Base from 'db-migrate-base';

/**
 * Add foreign key to Organizations table for 1-1 relationship with Organization Applications
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organizations
    ADD COLUMN organization_application_id INTEGER,
    ADD UNIQUE (organization_application_id),
    ADD FOREIGN KEY (organization_application_id)
    REFERENCES organization_applications(id);
  `,
    callback
  );
}

/**
 * Remove foreign key from Organizations table
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organizations
    DROP COLUMN organization_application_id;
  `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
