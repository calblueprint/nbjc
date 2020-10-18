import Base from 'db-migrate-base';
import { promisify } from 'util';
/**
 * Describe what your `up` migration does.
 */
export async function up(
  db: Base,
  callback: Base.CallbackFunction
): Promise<void> {
  const createTable = promisify(db.createTable.bind(db));
  try {
    await createTable('organization_applications', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      status: ['draft', 'submitted', 'approved', 'rejected'],
      question: 'string',
    });
    db.addForeignKey(
      'organization_applications',
      'organizations',
      'organization_id',
      {
        organization_id: 'id',
      },
      {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      },
      callback
    );
  } catch (err) {
    callback(err, null);
  }
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
