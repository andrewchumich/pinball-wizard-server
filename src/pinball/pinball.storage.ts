var sqlite3 = require('sqlite3').verbose()
import { DATABASE_PATH } from '../storage'
import { User } from '../user'
let db;

// not sure if these should be split up into different modules,
// but this will be good enough for now

export const getDatabase = function getDatabase() {
  if (db !== undefined) {
    return db
  }
  try {
    db = new sqlite3.Database(DATABASE_PATH)
    return db
  } catch (e) {
    console.error('Error getting database')
    console.error(e)
  }
}

export const getUser = function getUser(name: string, callback: (err, user) => any) {
  
  let db = getDatabase()
  db.serialize(() => {
    const GET_USER_STATEMENT = 'SELECT id, name FROM users WHERE name = ?'
    console.log(name)
    let row = db.get(GET_USER_STATEMENT, [name], callback)
  })
}