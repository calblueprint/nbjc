import Base from 'db-migrate-base';

/**
 * Add foreign key to Organization Applications table for many to 1 relationship with Users
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organization_applications
    ADD COLUMN user_id INTEGER,
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id);
  `,
    callback
  );
}

/**
 * Remove foreign key from Organization Applications table
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organization_applications
    DROP COLUMN user_id;
  `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
