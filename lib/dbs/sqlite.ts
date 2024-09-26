import { Database } from 'sqlite3'
import { promisify } from 'util'
import { SessionProps, StoreData } from '../../types'

const db = new Database(process.env.SQLITE_DATABASE || ':memory:')
const query = promisify(db.all.bind(db))

// Use setUser for storing global user data (persists between installs)
export async function setUser({ user }: SessionProps) {
  if (!user) return null

  const { email, id, username } = user
  const userData = { email, userId: id, username }

  await query(
    'REPLACE INTO users (email, userId, username) VALUES (?, ?, ?)',
    Object.values(userData)
  )
}

export async function setStore(session: SessionProps) {
  const { access_token: accessToken, context, scope } = session
  // Only set on app install or update
  if (!accessToken || !scope) return null

  const storeHash = context?.split('/')[1] || ''
  const storeData: StoreData = { accessToken, scope, storeHash }

  await query(
    'REPLACE INTO stores (accessToken, scope, storeHash) VALUES (?, ?, ?)',
    Object.values(storeData)
  )
}

// Use setStoreUser for storing store specific variables
export async function setStoreUser(session: SessionProps) {
  const {
    access_token: accessToken,
    context,
    owner,
    sub,
    user: { id: userId },
  } = session
  if (!userId) return null

  const contextString = context ?? sub
  const storeHash = contextString?.split('/')[1] || ''
  const sql = 'SELECT * FROM storeUsers WHERE userId = ? AND storeHash = ?'
  const values = [String(userId), storeHash]
  const storeUser = await query(sql, values)

  // Set admin (store owner) if installing/ updating the app
  // https://developer.bigcommerce.com/api-docs/apps/guide/users
  if (accessToken) {
    // Create a new admin user if none exists
    if (!storeUser.length) {
      await query(
        'INSERT INTO storeUsers (isAdmin, storeHash, userId) VALUES (?, ?, ?)',
        [true, storeHash, userId]
      )
    } else if (!storeUser[0]?.isAdmin) {
      await query(
        'UPDATE storeUsers SET isAdmin=1 WHERE userId = ? AND storeHash = ?',
        values
      )
    }
  } else {
    // Create a new user if it doesn't exist (non-store owners added here for multi-user apps)
    if (!storeUser.length) {
      await query(
        'INSERT INTO storeUsers (isAdmin, storeHash, userId) VALUES (?, ?, ?)',
        [owner.id === userId, storeHash, userId]
      )
    }
  }
}

export async function deleteUser({ context, user, sub }: SessionProps) {
  const contextString = context ?? sub
  const storeHash = contextString?.split('/')[1] || ''
  const values = [String(user?.id), storeHash]
  await query(
    'DELETE FROM storeUsers WHERE userId = ? AND storeHash = ?',
    values
  )
}

export async function hasStoreUser(storeHash: string, userId: string) {
  if (!storeHash || !userId) return false

  const values = [userId, storeHash]
  const results = await query(
    'SELECT * FROM storeUsers WHERE userId = ? AND storeHash = ? LIMIT 1',
    values
  )

  return results.length > 0
}

export async function getStoreToken(storeHash: string) {
  if (!storeHash) return null

  const results = await query(
    'SELECT accessToken FROM stores WHERE storeHash = ?',
    [storeHash]
  )

  return results.length ? results[0].accessToken : null
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
  await query('DELETE FROM stores WHERE storeHash = ?', [storeHash])
}
