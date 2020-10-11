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
    await createTable('organizations', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      name: { type: 'string', notNull: true },
      long: 'decimal',
      lat: 'decimal',
      type: 'string',
    });
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
  const dropTable = promisify<string>(db.dropTable.bind(db));
  try {
    await dropTable('organizations');
  } catch (err) {
    callback(err, null);
  }
}
// eslint-disable-next-line no-underscore-dangle
export const _meta = {
  version: 1,
};
