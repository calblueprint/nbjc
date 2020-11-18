import Base from 'db-migrate-base';

/**
 * Add static fields to Organizations table
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organizations
    ADD COLUMN  application_status  application_status  NOT NULL DEFAULT 'draft',
    ADD COLUMN  active              BOOLEAN             NOT NULL DEFAULT false,
    ADD COLUMN  contact_name        VARCHAR(255)        NOT NULL,
    ADD COLUMN  contact_email       VARCHAR(255)        NOT NULL,
    ADD COLUMN  organization_type   organization_type,
    ADD COLUMN  work_type           work_type,
    ADD COLUMN  address             VARCHAR(255),
    ADD COLUMN  mission_statement   TEXT,
    ADD COLUMN  short_history       TEXT,
    ADD COLUMN  key_values          TEXT,
    ADD COLUMN  lgbtq_demographic   lgbtq_demographic[],
    ADD COLUMN  race_demographic    race_demographic[],
    ADD COLUMN  age_demographic     age_demographic[],
    ADD COLUMN  capacity            INTEGER,
    ADD COLUMN  ein                 INTEGER,
    ADD COLUMN  founding_date       DATE,
    ADD COLUMN  is_501c3            BOOLEAN             NOT NULL DEFAULT false;
  `,
    callback
  );
}

/**
 * Remove static fields from Organizations table
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TABLE organizations
    DROP COLUMN application_status,
    DROP COLUMN active,
    DROP COLUMN contact_name,
    DROP COLUMN contact_email,
    DROP COLUMN organization_type,
    DROP COLUMN work_type,
    DROP COLUMN address,
    DROP COLUMN mission_statement,
    DROP COLUMN short_history,
    DROP COLUMN key_values,
    DROP COLUMN lgbtq_demographic,
    DROP COLUMN race_demographic,
    DROP COLUMN age_demographic,
    DROP COLUMN capacity,
    DROP COLUMN ein,
    DROP COLUMN founding_date;
  `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
