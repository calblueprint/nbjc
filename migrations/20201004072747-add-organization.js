'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('organization', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: 'string',
    lat: 'int',
    long: 'int',
    type: 'string',
    many_users: 'boolean',
    one_app: 'boolean',
  });
};

exports.down = function (db) {
  return db.dropTable('organization');
};

exports._meta = {
  version: 1,
};
