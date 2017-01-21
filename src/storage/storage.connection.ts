var sqlite3 = require('sqlite3').verbose()

export interface IConnectionManager {
  getConnection: (dbPath?:string) => Promise<any>
  closeConnection: () => Promise<any>
}


let db_obj: any

export const ConnectionManager: IConnectionManager = {
  getConnection: (dbPath:string = ':memory:') => {
    const FOREIGN_KEY_STATEMENT = 'PRAGMA foreign_keys = ON;'
    return new Promise((resolve, reject) => {
      if (!db_obj) {
        db_obj = new sqlite3.Database(dbPath, (err) => {
          if (err !== null) {
            reject(err)
          } else {
            db_obj.run(FOREIGN_KEY_STATEMENT, (err) => {
              if (err !== null) {
                reject(err)
              } else {
                resolve(db_obj)
              }
            })
          }
        })
      } else {
        resolve(db_obj)
      }
    })
  },
  closeConnection: () => {
    return new Promise((resolve, reject) => {
      if (!db_obj) {
        resolve(false)
      } else {
        db_obj.close((err) => {
          if (err !== null) {
            reject(err)
          } else {
            db_obj = undefined
            resolve(true)
          }
        })
      }
    })
  }
}