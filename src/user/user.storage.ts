var sqlite3 = require('sqlite3').verbose()
import { DATABASE_PATH } from '../storage'
import { User } from './user'
let db;


export const createUsersTable = function createUsersTable(): Promise<any> {
  const CREATE_USERS_TABLE_STATEMENT = `
    CREATE TABLE users 
    (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )
  `
  return new Promise((resolve, reject) => {
    getDatabase().then((db) => {
      db.run(CREATE_USERS_TABLE_STATEMENT, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(db)
        }
      })
    })
  })
}

// not sure if these should be split up into different modules,
// but this will be good enough for now

export const destroyDatabase = function destroyDatabase(): boolean {
  if (!db) {
    return false
  } else {
    db = undefined
    return true
  }
}

export const getDatabase = function getDatabase(dbPath?: string): Promise<any> {
  if (!dbPath) {
    dbPath = DATABASE_PATH
  }
  if (db !== undefined) {
    return new Promise((resolve) => {
      resolve(db)
    })
  }
  return new Promise((resolve, reject) => {
    try {
      db = new sqlite3.Database(dbPath)
      resolve(db)
    } catch (e) {
      console.error('Error getting database')
      console.error(e)
      reject(e)
    }
  })
}

export const addUser = function addUser(name: string): Promise<User> {
  const ADD_USER_STATEMENT = 'INSERT INTO users VALUES (?, ?)'
  return new Promise((resolve, reject) => {
    getDatabase().then((db) => {
      db.run(ADD_USER_STATEMENT, [null, name], (err) => {
        if (err) {
          return reject(err)
        }
        return resolve(getUser(name))
      })
    })
  })
}

export const getUser = function getUser(name: string): Promise<User> {
  
  return getDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        const GET_USER_STATEMENT = 'SELECT * FROM users WHERE name = ?'
        let row = db.get(GET_USER_STATEMENT, [name], (error, row) => {
          if (error) {
            reject(error)
          }
          resolve(new User(row))
        })
      })
    })
  })
}