import Base from 'db-migrate-base';
/**
 * Create enums to be used by Organizations table
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
    `,
    callback
  );
}

/**
 * Remove enums to be used by Organizations table
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  try {
    db.runSql(
      `
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
