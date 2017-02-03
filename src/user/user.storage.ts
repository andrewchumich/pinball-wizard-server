var sqlite3 = require('sqlite3').verbose()
import { DATABASE_PATH } from '../storage'
import { User } from './user'
import { Storage } from '../storage'

let storage_obj: UserStorage

export class UserStorage extends Storage {
  public TABLE_NAME = 'users'
  public CREATE_TABLE_STATEMENT =  `
    CREATE TABLE ${this.TABLE_NAME} 
    (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )
  `
  public ADD_STATEMENT = `INSERT INTO ${this.TABLE_NAME} VALUES (?, ?)`

  public GET_STATEMENT = `SELECT * FROM ${this.TABLE_NAME} WHERE name = ?`

  public add = (user: User): Promise<User> => {
    return new Promise((resolve, reject) => {
      this.getDatabase().then((db) => {
        db.run(this.ADD_STATEMENT, [null, user.name], (err) => {
          if (err) {
            return reject(err)
          }
          return resolve(this.get(user.name))
        })
      })
    })
  }

  public get = (name: string): Promise<User> => {
    return this.getDatabase().then((db) => {
      return new Promise((resolve, reject) => {
        db.get(this.GET_STATEMENT, [name], (error, row) => {
          if (error) {
            reject(error)
          }
          if (row === undefined) {
            reject(undefined)
          } else {
            resolve(new User(row))
          }
        })
      })
    }) 
  }
}

export const getUserStorage = function getUserStorage(): UserStorage {
  if (!storage_obj) {
    storage_obj = new UserStorage()
  }

  return storage_obj
}