var sqlite3 = require('sqlite3').verbose()
import { ConnectionManager } from '../storage'

export abstract class Storage {

  constructor() {
  }

  abstract TABLE_NAME: string
  abstract CREATE_TABLE_STATEMENT: string
  abstract ADD_STATEMENT: string
  abstract GET_STATEMENT: string

  // TODO
  // abstract UPDATE_STATEMENT
  // abstract DELETE_STATEMENT

  abstract add: (obj: any) => Promise<any>

  abstract get: (key: any) => Promise<any>

  // TODO
  // abstract update: (obj: any) => Promise<any>
  // abstract delete: (key: any) => Promise<boolean>

  public getDatabase = (): Promise<any> => {
    return ConnectionManager.getConnection()
  }

  //
  public createConnection = (): Promise<any> => {
    const FOREIGN_KEY_ON_STATEMENT = 'PRAGMA foreign_keys = \'ON\''
    return new Promise((resolve, reject) => {
      this.getDatabase().then((db) => {
        db.run(FOREIGN_KEY_ON_STATEMENT, (err) => {
          if (err) {
            console.error('Storage::createTable -- foreign key error:', err)
            reject(err)
          } else {
            resolve(db)
          }
        })
      })
    })    
  }

  public createTable = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.getDatabase().then((db) => {
        db.run(this.CREATE_TABLE_STATEMENT, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(db)
          }
        })
      })
    })
  }
    
}