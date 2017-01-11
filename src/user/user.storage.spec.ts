var sqlite3 = require('sqlite3').verbose()
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var expect = chai.expect
chai.should()

import { User } from './user'
import { getDatabase, addUser, getUser, createUsersTable, destroyDatabase } from './user.storage'

describe('pinball storage', () => {

    let db;
    beforeEach((done) => {
      destroyDatabase()
      getDatabase(':memory:').then((d) => {
        db = d
        createUsersTable().then(() => {
          done()
        }, (err) => {
          console.log('ERROR', err)
        })
      })

    });

    it('should create database', () => {
      expect(db).to.exist
    })

    it('should add user', () => {
      const USER_NAME = 'ALC'
      let addUserPromise = addUser(USER_NAME)
      return addUserPromise.should.eventually.have.property('name', USER_NAME)
    })

    it('should not be able to add user twice', () => {
      const USER_NAME = 'ALC'
      let addUserPromise = addUser(USER_NAME).then((user) => {
        return addUser(USER_NAME)
      })
      return addUserPromise.should.eventually.be.rejected
    })
})