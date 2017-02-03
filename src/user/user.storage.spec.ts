var sqlite3 = require('sqlite3').verbose()
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var expect = chai.expect
chai.should()

import { User } from './user'
import { getUserStorage, UserStorage } from './user.storage'
import { ConnectionManager } from '../storage'

describe('pinball storage', () => {
    const STORAGE_LOCATION = ':memory:'

    let userStorage = getUserStorage()
    beforeEach((done) => {
      // create database
      ConnectionManager.getConnection(STORAGE_LOCATION).then((db) => {
        return userStorage.createTable()
      }).then(() => {
        done()
      })
    })

    afterEach((done) => {
      // destroy database
      ConnectionManager.closeConnection().then((res) => {
        done()
      })
    })

    it('should add user', () => {
      const USER_NAME = 'ALC'
      let user = new User({ name: USER_NAME })
      let addUserPromise = userStorage.add(user)
      return addUserPromise.should.eventually.have.property('name', USER_NAME)
    })

    it('should not be able to add user twice', () => {
      const USER_NAME = 'ALC'
      let user = new User({ name: USER_NAME })
      let addUserPromise = userStorage.add(user).then((u) => {
        return userStorage.add(user)
      })
      return addUserPromise.should.eventually.be.rejected
    })
    
    it('should reject when getting user which doesn\'t exist', () => {
      const NEW_USER_NAME = 'NEW_USER'
      let getUserPromise = userStorage.get(NEW_USER_NAME)

      return getUserPromise.should.eventually.be.rejectedWith(undefined)
    })
})