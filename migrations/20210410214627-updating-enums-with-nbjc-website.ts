import Base from 'db-migrate-base';

/**
 * Describe what your `up` migration does.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TYPE lgbtq_demographic RENAME TO lgbtq_demographic_old;
    CREATE TYPE lgbtq_demographic AS ENUM ('Queer', 'Asexual/Aromantic', 'Bisexual', 'Pansexual', 'Lesbian/SGL', 'Gay/SGL', 'Straight/Heterosexual', 'Other');
    ALTER TABLE organization ALTER COLUMN lgbtqDemographic TYPE lgbtq_demographic USING lgbtqDemographic::text::lgbtq_demographic;
    DROP TYPE lgbtq_demographic_old;
    `,
    callback
  );
}

// ALTER TYPE lgbtq_demographic ADD VALUE 'Queer' BEFORE 'LGBTQ+ (ALL)';
// ALTER TYPE lgbtq_demographic ADD VALUE 'Bisexual' BEFORE 'LGBTQ+ (ALL)';
// ALTER TYPE lgbtq_demographic ADD VALUE 'Pansexual' BEFORE 'LGBTQ+ (ALL)';
// ALTER TYPE lgbtq_demographic ADD VALUE 'Lesbian/SGL' BEFORE 'LGBTQ+ (ALL)';
// ALTER TYPE lgbtq_demographic ADD VALUE 'Gay/SGL' BEFORE 'LGBTQ+ (ALL)';
// ALTER TYPE lgbtq_demographic ADD VALUE 'Straight/Heterosexual' BEFORE 'LGBTQ+ (ALL)';
// ALTER TYPE lgbtq_demographic DROP ATTRIBUTE 'LGBTQ+ (All)';
// ALTER TYPE lgbtq_demographic DROP ATTRIBUTE 'SGL';
// ALTER TYPE lgbtq_demographic DROP ATTRIBUTE 'Transgender';

// ALTER TYPE lgbtq_demographic DROP ATTRIBUTE 'Queer';
// ALTER TYPE lgbtq_demographic DROP ATTRIBUTE 'Bisexual';
// ALTER TYPE lgbtq_demographic DROP ATTRIBUTE 'Pansexual';
// ALTER TYPE lgbtq_demographic DROP ATTRIBUTE 'Lesbian/SGL';
// ALTER TYPE lgbtq_demographic DROP ATTRIBUTE 'Gay/SGL';
// ALTER TYPE lgbtq_demographic DROP ATTRIBUTE 'Straight/Heterosexual';
// ALTER TYPE lgbtq_demographic ADD VALUE 'LGBTQ+ (All)';
// ALTER TYPE lgbtq_demographic ADD VALUE 'SGL';
// ALTER TYPE lgbtq_demographic ADD VALUE 'Transgender';

// ALTER TYPE race_demographic AS ENUM ('Black', 'Native', 'Hispanic', 'Asian', 'Arab', 'White', 'Other');

/**
 * Describe what your `down` migration does.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  db.runSql(
    `
    ALTER TYPE lgbtq_demographic RENAME TO lgbtq_demographic_old;
    CREATE TYPE lgbtq_demographic AS ENUM ('LBGTQ+ (All)', 'SGL', 'Transgender', 'Asexual/Aromantic', 'Other');
    ALTER TABLE organization ALTER COLUMN lgbtqDemographic TYPE lgbtq_demographic USING lgbtqDemographic::text::lgbtq_demographic;
    DROP TYPE lgbtq_demographic_old;
    `,
    callback
  );
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
