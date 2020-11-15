import Base from 'db-migrate-base';
import { promisify } from 'util';

/**
 * Create the Application Questions table for custom questions
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    CREATE TABLE application_questions
      (
        id           SERIAL,
        question     VARCHAR(255) NOT NULL,
        hint         TEXT,
        placeholder  TEXT,
        required     BOOLEAN NOT NULL DEFAULT FALSE,
        word_limit   INTEGER,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );
  `,
    callback
  );
}

/**
 * Drop the Application Questions table
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const dropTable = promisify<string>(db.dropTable.bind(db));
  try {
    await dropTable('application_questions');
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
