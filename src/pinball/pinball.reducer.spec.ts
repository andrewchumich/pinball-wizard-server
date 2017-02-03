var chai = require('chai')
var expect = chai.expect

import { cloneDeep } from 'lodash'
import { pinballReducer, defaultState, SET_USER, SET_SCORE, START_GAME, END_GAME } from './pinball.reducer'
import { status } from './status.enum'
import { User } from '../user'
import { action } from '../reducers'

describe('pinball reducer', () => {
  it('should set user', () => {
    const state = cloneDeep(defaultState)
    expect(state.score.user).to.be.eql(new User())

    const name = 'ALC'
    const id = 1
    const user = new User({ name, id })
    const test_action: action = {
      type: SET_USER,
      payload: user
    }

    expect(pinballReducer(state, test_action).score.user).to.be.eql(user)
  })

  it('should set score', () => {
    const state = cloneDeep(defaultState)
    expect(state.score.score).to.be.equal(0)

    const score = 10
    const test_action = {
      type: SET_SCORE,
      payload: score
    }
    expect(pinballReducer(state, test_action).score.score).to.be.equal(score)

  })

  it('should start game', () => {
    const state = cloneDeep(defaultState)    
    expect(state.status).to.be.equal(status.STOPPED)

    const test_action = {
      type: START_GAME
    }
    expect(pinballReducer(state, test_action).status).to.be.equal(status.RUNNING)

  })

  it('should end game', () => {
    const state = { ...defaultState, status: status.RUNNING }
    expect(state.status).to.be.equal(status.RUNNING)

    const test_action = {
      type: END_GAME
    }
    expect(pinballReducer(state, test_action).status).to.be.equal(status.STOPPED)

  })

})