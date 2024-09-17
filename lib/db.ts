import { Db } from '../types';
import * as firebaseDB from './dbs/firebase';
import * as sqlDB from './dbs/mysql';
import * as sqliteDB from './dbs/sqlite'

const { DB_TYPE } = process.env;

let db: Db;

switch (DB_TYPE) {
  case 'firebase':
    db = firebaseDB
    break
  case 'mysql':
    db = sqlDB
    break
  case 'sqlite':
    db = sqliteDB
    break
  default:
    db = firebaseDB
    break
}

export default db;
