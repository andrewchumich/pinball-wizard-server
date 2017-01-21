var sqlite3 = require('sqlite3').verbose()
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var expect = chai.expect
chai.should()

import { User, UserStorage, getUserStorage } from '../user'
import { Score } from './score'
import { getScoreStorage, ScoreStorage } from './score.storage'
import { ConnectionManager } from '../storage'

describe('pinball storage', () => {
    let testUser = new User({ name: 'ALC' })
    const STORAGE_LOCATION = ':memory:'
    let scoreStorage = getScoreStorage()
    let userStorage = getUserStorage()
    beforeEach((done) => {
      // create database
      ConnectionManager.getConnection(STORAGE_LOCATION).then((db) => {
        return userStorage.createTable()
      }).then(() => {
        return scoreStorage.createTable()
      }).then(() => {
        return userStorage.add(testUser)
      }).then((user) => {
        testUser = user
        done()
      })
    })

    afterEach((done) => {
      // destroy database
      ConnectionManager.closeConnection().then((res) => {
        done()
      })
    })


    it('should add score', () => {
      const my_score: Score = new Score({ score: 10, user: testUser })
      return scoreStorage.add(my_score).should.eventually.eql(my_score)
    })

})