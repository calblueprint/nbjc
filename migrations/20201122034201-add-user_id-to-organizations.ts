import Base from 'db-migrate-base';

/**
 * Adds a 1-1 connection from Organizations to Users.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organizations
    ADD COLUMN user_id INTEGER,
    ADD UNIQUE (user_id),
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id);
  `,
    callback
  );
}

/**
 * Removes connection between Organizations and Users.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organizations
    DROP COLUMN user_id;
  `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
