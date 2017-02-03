import { DATABASE_PATH } from './storage'
import { getUserStorage } from './user'
import { getScoreStorage } from './score'
import { Storage, ConnectionManager } from './storage'

const GET_FUNCTIONS: Array<() => Storage>  = [
  getUserStorage,
  getScoreStorage
]

let createPromise: Promise<any> = ConnectionManager.getConnection(DATABASE_PATH)

for (let i = 0; i < GET_FUNCTIONS.length; i++) {
  createPromise.then(() => {
    return GET_FUNCTIONS[i]().createTable()
  })
}

createPromise.then(() => {
  return ConnectionManager.closeConnection()
}).then((res) => {
  console.log('Initialize database succeeded')
}, (err) => {
  console.log('Initialize database failed:')
  console.error(err)
})
