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
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `

  public ADD_STATEMENT = `INSERT INTO ${this.TABLE_NAME} VALUES (?, ?, ?)`
  public GET_STATEMENT = `SELECT * FROM ${this.TABLE_NAME} LEFT OUTER JOIN users ON ${this.TABLE_NAME}.user_id = ?`

  public mapRowToScore = (row: any): Score => {
    let score = row.score
    let user = new User({ name: row.name, id: row.user_id })

    return new Score({ score, user })
  }

  public add = (score: Score): Promise<Score> => {
    return new Promise((resolve, reject) => {
      this.getDatabase().then((db) => {
        let getFn: (id: number) => Promise<Score> = this.get
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
        let row = db.get(this.GET_STATEMENT, [id], (err, row) => {
          if (err) {
            console.log('ERR GET:', id, err)
            reject(err)
          }
          resolve(this.mapRowToScore(row))
        })
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