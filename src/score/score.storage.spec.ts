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

    it('should not add score from bad user', () => {
      const bad_user = new User({ name: 'BAD' })
      const bad_score = new Score({ score: 100, user: bad_user })
      return scoreStorage.add(bad_score).should.eventually.be.rejected;
    })

    it('should be able to get all scores for a user', (done) => {
      const score_1 = new Score({ score: 10, user: testUser })
      const score_2 = new Score({ score: 200, user: testUser })

      scoreStorage.add(score_1).then(() => {
        return scoreStorage.add(score_2)
      }).then(() => {
        return scoreStorage.getAll({ user_id: testUser.id })
      }).then((scores: Score[]) => {
        expect(scores.length).to.be.equal(2)
        done()
      }, (err) => {
        console.log(err)
        done()
      })
    })

    it('should be able to get top scores', (done) => {
      const temp_user = new User({ name: 'JZ' })
      const score_1 = new Score({ score: 10, user: testUser })
      const score_2 = new Score({ score: 200, user: testUser })
      const score_3 = new Score({ score: 500, user: testUser })
      const score_4 = new Score({ score: 400, user: testUser })
      const score_5 = new Score({ score: 300, user: testUser })

      let temp_user_score: Score
      let saved_temp_user: User
      userStorage.add(temp_user).then((user) => {
        saved_temp_user = user;
        temp_user_score = new Score({ user: saved_temp_user, score: 600 })
        return scoreStorage.add(temp_user_score)
      }).then(() => {
        return scoreStorage.add(score_1)
      }).then(() => {
        return scoreStorage.add(score_2)
      }).then(() => {
        return scoreStorage.add(score_3)
      }).then(() => {
        return scoreStorage.add(score_4)
      }).then(() => {
        return scoreStorage.add(score_5)
      }).then(() => {
        return scoreStorage.getAll({ top: 50 })
      }).then((scores: Score[]) => {
        expect(scores.length).to.be.equal(6)
        expect(scores[0].score).to.be.equal(temp_user_score.score)
        expect(scores[0].user.id).to.be.equal(saved_temp_user.id)
        expect(scores[1].score).to.be.equal(score_3.score)
        expect(scores[5].score).to.be.equal(score_1.score)
        done()
      }, (err) => {
        console.log(err)
        expect(true).to.be.equal(false)
        done()
      })
    })

    it('should be able to get top scores and limit', (done) => {
      const temp_user = new User({ name: 'JZ' })
      const score_1 = new Score({ score: 10, user: testUser })
      const score_2 = new Score({ score: 200, user: testUser })
      const score_3 = new Score({ score: 500, user: testUser })
      const score_4 = new Score({ score: 400, user: testUser })
      const score_5 = new Score({ score: 300, user: testUser })

      let temp_user_score: Score
      let saved_temp_user: User
      userStorage.add(temp_user).then((user) => {
        saved_temp_user = user;
        temp_user_score = new Score({ user: saved_temp_user, score: 600 })
        return scoreStorage.add(temp_user_score)
      }).then(() => {
        return scoreStorage.add(score_1)
      }).then(() => {
        return scoreStorage.add(score_2)
      }).then(() => {
        return scoreStorage.add(score_3)
      }).then(() => {
        return scoreStorage.add(score_4)
      }).then(() => {
        return scoreStorage.add(score_5)
      }).then(() => {
        return scoreStorage.getAll({ top: 3 })
      }).then((scores: Score[]) => {
        expect(scores.length).to.be.equal(3)
        expect(scores[0].score).to.be.equal(temp_user_score.score)
        expect(scores[0].user.id).to.be.equal(saved_temp_user.id)
        expect(scores[1].score).to.be.equal(score_3.score)
        expect(scores[2].score).to.be.equal(score_4.score)
        done()
      }, (err) => {
        console.log(err)
        done()
      })
    })

})