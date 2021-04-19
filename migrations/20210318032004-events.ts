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
    CREATE TABLE organization_events
      (
        id                           SERIAL,
        title                        TEXT NOT NULL,
        description                  TEXT NOT NULL,
        address                      VARCHAR(255),
        link                         VARCHAR(255),
        lgbtq_demographic            lgbtq_demographic[],
        race_demographic             race_demographic[],
        age_demographic              age_demographic[],
        organization_id              INTEGER NOT NULL,
        start_datetime               TIMESTAMPTZ NOT NULL,
        end_datetime                 TIMESTAMPTZ,
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
    await dropTable('organization_events');
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
