var sqlite3 = require('sqlite3').verbose()
import { DATABASE_PATH } from '../storage'
import { User } from '../user'
import { Storage } from '../storage'
import { Score } from './score'
let storage_obj: ScoreStorage;

export class ScoreStorage extends Storage {
  public TABLE_NAME = 'scores'
  public CREATE_TABLE_STATEMENT = `
    CREATE TABLE scores 
    (
      id INTEGER PRIMARY KEY,
      score INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `

  public ADD_STATEMENT = `INSERT INTO ${this.TABLE_NAME} VALUES (?, ?, ?)`
  public GET_STATEMENT = `SELECT * FROM ${this.TABLE_NAME} LEFT OUTER JOIN users ON users.id = ${this.TABLE_NAME}.user_id WHERE ${this.TABLE_NAME}.id = ?`
  public GET_ALL_BY_USER_ID_STATEMENT = `SELECT * FROM ${this.TABLE_NAME} LEFT OUTER JOIN users ON ${this.TABLE_NAME}.user_id = ?`
  public GET_ALL_STATEMENT = `SELECT * FROM ${this.TABLE_NAME} LEFT OUTER JOIN users ON ${this.TABLE_NAME}.user_id = users.id`
  public mapRowToScore = (row: any): Score => {
    let score = row.score
    let user = new User({ name: row.name, id: row.user_id })

    return new Score({ score, user })
  }

  public add = (score: Score): Promise<Score> => {
    return new Promise((resolve, reject) => {
      this.getDatabase().then((db) => {
        let getFn: (id: number) => Promise<Score> = this.get
        // for some reason, adding an undefined key to a foreign key field doesn't throw an error
        const SCORE_ID = (score.user.id === undefined || score.user.id === null) ? -1 : score.user.id 
        db.run(this.ADD_STATEMENT, [null, score.score, score.user.id], function(err) {
          if (err) {
            console.log('ERR ADD:', score, err)
            return reject(err)
          }
          if (this.hasOwnProperty('lastID')) {
            return resolve(getFn(this.lastID))
          } else {
            return reject('Add failed, could not find \'lastID\'')
          }
        })
      })
    })
  }

  public get = (id: number): Promise<Score> => {
    return this.getDatabase().then((db) => {
      return new Promise((resolve, reject) => {
        db.get(this.GET_STATEMENT, [id], (err, row) => {
          if (err) {
            console.log('ERR GET:', id, err)
            reject(err)
          }
          resolve(this.mapRowToScore(row))
        })
      })
    }) 
  }

  public getAll = (options: { user_id?: number, top?: number, limit?: number } = {}): Promise<Score[]> => {
    let order_by = ` ORDER BY ${this.TABLE_NAME}.score DESC`
    if (options.top) {
      order_by += ` LIMIT ${options.top}`
    } else if (options.limit) {
      order_by += ` LIMIT ${options.limit}`
    }
    return this.getDatabase().then((db) => {
      return new Promise((resolve, reject) => {
        if (!options.user_id) {
          db.all(this.GET_ALL_STATEMENT  + order_by, [], (err, rows) => {
            if (err) {
              reject(err)
            } else {
              resolve(rows.map(this.mapRowToScore))
            }
          })
        } else {
          db.all(this.GET_ALL_BY_USER_ID_STATEMENT  + order_by, [options.user_id], (err, rows) => {
            if (err) {
              reject(err)
            } else {
              resolve(rows.map(this.mapRowToScore))
            }
          })
        }
      })
    })
  }
}


export const getScoreStorage = function getScoreStorage(): ScoreStorage {
  if (!storage_obj) {
    storage_obj = new ScoreStorage()
  }

  return storage_obj
}