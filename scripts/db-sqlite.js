const sqlite3 = require('sqlite3').verbose();
const util = require('util');
require('dotenv').config();

const db = new sqlite3.Database(process.env.SQLITE_DATABASE || ':memory:');
const query = util.promisify(db.all.bind(db));

const usersCreate = query('CREATE TABLE `users` (\n' +
  '  `id` INTEGER PRIMARY KEY AUTOINCREMENT,\n' +
  '  `userId` INTEGER NOT NULL,\n' +
  '  `email` TEXT NOT NULL,\n' +
  '  `username` TEXT,\n' +
  '  UNIQUE (`userId`)\n' +
  ');\n'
);

const storesCreate = query('CREATE TABLE `stores` (\n' +
  '  `id` INTEGER PRIMARY KEY AUTOINCREMENT,\n' +
  '  `storeHash` TEXT NOT NULL,\n' +
  '  `accessToken` TEXT,\n' +
  '  `scope` TEXT,\n' +
  '  UNIQUE (`storeHash`)\n' +
  ');\n'
);

const storeUsersCreate = query('CREATE TABLE `storeUsers` (\n' +
  '  `id` INTEGER PRIMARY KEY AUTOINCREMENT,\n' +
  '  `userId` INTEGER NOT NULL,\n' +
  '  `storeHash` TEXT NOT NULL,\n' +
  '  `isAdmin` INTEGER,\n' +
  '  UNIQUE (`userId`,`storeHash`)\n' +
  ');\n'
);

Promise.all([usersCreate, storesCreate, storeUsersCreate]).then(() => {
  console.log('Database created');
  db.close();
});