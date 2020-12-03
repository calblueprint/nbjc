import Base from 'db-migrate-base';

/**
 * Describe what your `up` migration does.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  // write migration up here
}

/**
 * Describe what your `down` migration does.
 */
export async function down(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  // write migration down here
}

// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
