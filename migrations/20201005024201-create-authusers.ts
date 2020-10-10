import Base from 'db-migrate-base';
import { promisify } from 'util';

export function up(db: Base, callback: Base.CallbackFunction): void {
  db.runSql(
    `
      CREATE TYPE user_role AS ENUM ('organization', 'moderator', 'admin');
      CREATE TABLE accounts
        (
          id                   SERIAL,
          compound_id          VARCHAR(255) NOT NULL,
          user_id              INTEGER NOT NULL,
          provider_type        VARCHAR(255) NOT NULL,
          provider_id          VARCHAR(255) NOT NULL,
          provider_account_id  VARCHAR(255) NOT NULL,
          refresh_token        TEXT,
          access_token         TEXT,
          access_token_expires TIMESTAMPTZ,
          created_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );
      CREATE TABLE sessions
        (
          id            SERIAL,
          user_id       INTEGER NOT NULL,
          expires       TIMESTAMPTZ NOT NULL,
          session_token VARCHAR(255) NOT NULL,
          access_token  VARCHAR(255) NOT NULL,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );
      CREATE TABLE users
        (
          id             SERIAL,
          first_name     VARCHAR(255),
          last_name      VARCHAR(255),
          role           user_role,
          email          VARCHAR(255),
          email_verified TIMESTAMPTZ,
          image          VARCHAR(255),
          created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );
      CREATE TABLE verification_requests
        (
          id         SERIAL,
          identifier VARCHAR(255) NOT NULL,
          token      VARCHAR(255) NOT NULL,
          expires    TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );
      CREATE UNIQUE INDEX compound_id
        ON accounts(compound_id);
      CREATE INDEX provider_account_id
        ON accounts(provider_account_id);
      CREATE INDEX provider_id
        ON accounts(provider_id);
      CREATE INDEX user_id
        ON accounts(user_id);
      CREATE UNIQUE INDEX session_token
        ON sessions(session_token);
      CREATE UNIQUE INDEX access_token
        ON sessions(access_token);
      CREATE UNIQUE INDEX email
        ON users(email);
      CREATE UNIQUE INDEX token
        ON verification_requests(token);
    `,
    callback
  );
}

export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const removeIndex = promisify<string>(db.removeIndex.bind(db));
  const dropTable = promisify<string>(db.dropTable.bind(db));
  const runSql = promisify<string>(db.runSql.bind(db));
  try {
    // Drop indexes
    await removeIndex('token');
    await removeIndex('email');
    await removeIndex('access_token');
    await removeIndex('session_token');
    await removeIndex('user_id');
    await removeIndex('provider_id');
    await removeIndex('provider_account_id');
    await removeIndex('compound_id');

    // Drop tables
    await dropTable('verification_requests');
    await dropTable('users');
    await dropTable('sessions');
    await dropTable('accounts');
    await runSql(`DROP TYPE user_role;`);
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
