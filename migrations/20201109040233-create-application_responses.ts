import Base from 'db-migrate-base';
import { promisify } from 'util';

/**
 * Create the Application Responses table for responses to custom questions
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    CREATE TABLE application_responses
      (
        id                           SERIAL,
        answer                       TEXT NOT NULL,
        question_id                  INTEGER NOT NULL,
        organization_id              INTEGER NOT NULL,
        created_at                   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at                   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (question_id)
          REFERENCES application_questions(id),
        FOREIGN KEY (organization_id)
          REFERENCES organizations(id)
      );
  `,
    callback
  );
}

/**
 * Drop the Application Responses table
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const dropTable = promisify<string>(db.dropTable.bind(db));
  try {
    await dropTable('application_responses');
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
