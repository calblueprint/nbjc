import Base from 'db-migrate-base';
/**
 * Describe what your `up` migration does.
 */
export function up(db: Base, callback: Base.CallbackFunction): void {
  db.runSql(
    `
      CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
      CREATE TYPE organization_type AS ENUM ('510(c)(3)', 'Grassroots/Local', 'Statewide', 'National', 'Other');
      CREATE TYPE work_type AS ENUM ('Advocacy', 'Direct Service', 'Networking/Social');
      CREATE TYPE lgbtq_demographic AS ENUM ('LGBTQ+ (All)', 'SGL', 'Transgender', 'Asexual/Aromantic', 'Other');
      CREATE TYPE race_demographic AS ENUM ('POC (All)', 'Black', 'Asian', 'Pacific Islander', 'Latinx', 'Native/Indigeneous', 'Other');
      CREATE TYPE age_demographic AS ENUM ('Children', 'Teens', 'Adults', 'Seniors');
      CREATE TABLE organization_applications (
          id                   SERIAL,
          application_status   application_status NOT NULL,
          organization_id      INTEGER NOT NULL,
          organization_name    VARCHAR(255) NOT NULL,
          contact_name         VARCHAR(255),
          contact_email        VARCHAR(255),
          organization_type    organization_type NOT NULL,
          work_type            work_type NOT NULL,
          address              VARCHAR(255) NOT NULL,
          lat                  DECIMAL NOT NULL,
          long                 DECIMAL NOT NULL,
          mission_statement    TEXT,
          short_history        TEXT,
          key_values           TEXT,
          lgbtq_demographic    lgbtq_demographic NOT NULL,
          race_demographic     race_demographic NOT NULL,
          age_demographic      age_demographic NOT NULL,
          capacity             INTEGER,
          ein                  INTEGER NOT NULL,
          founding_date        DATE NOT NULL,
          PRIMARY KEY (id),
          UNIQUE (organization_id),
          FOREIGN KEY (organization_id) references organizations(id)
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
  try {
    db.runSql(
      `
    DROP TABLE organization_applications;
    DROP TYPE application_status;
    DROP TYPE organization_type;
    DROP TYPE work_type;
    DROP TYPE lgbtq_demographic;
    DROP TYPE race_demographic;
    DROP TYPE age_demographic;
    `,
      callback
    );
  } catch (err) {
    callback(err, null);
  }
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
