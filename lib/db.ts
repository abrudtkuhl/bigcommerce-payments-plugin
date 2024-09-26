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

interface Db {
  hasStoreUser(storeHash: string, userId: string): Promise<boolean> | boolean;
  setUser(session: SessionProps): Promise<void>;
  setStore(session: SessionProps): Promise<void>;
  setStoreUser(session: SessionProps): Promise<void>;
  getStoreToken(storeId: string): Promise<string> | null;
  deleteStore(session: SessionProps): Promise<void>;
  deleteUser(session: SessionProps): Promise<void>;
  savePublicSquareSettings(storeHash: string, apiKey: string, toggleState: boolean): Promise<void>;
}

export default db;
