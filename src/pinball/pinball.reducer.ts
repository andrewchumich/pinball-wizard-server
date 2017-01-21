import { PinballState } from './PinballState.interface'
import { status } from './status.enum'


import { User } from '../user'
import { action } from '../reducers'
import { Score } from '../score'

export const SET_SCORE = 'SET_SCORE'
export const SET_USER = 'SET_USER'
export const START_GAME = 'START_GAME'
export const END_GAME = 'END_GAME'

export const defaultState: PinballState = {
  score: new Score({ score: 0, user: new User() }),
  status: status.STOPPED
}

export function pinballReducer(state: PinballState = defaultState, action: action = { type: '', payload: {} }): PinballState {
  var newState: PinballState
  switch (action.type) {
    case SET_SCORE:
      newState = Object.assign({}, state)
      newState.score = action.payload 
      return newState
    case SET_USER:
      newState = Object.assign({}, state)
      newState.score.user = action.payload
      return newState
    case START_GAME:
      newState = Object.assign({}, state)
      newState.status = status.RUNNING
      newState.score.score = 0
      return newState
    case END_GAME:
      newState = Object.assign({}, state)
      newState.status = status.STOPPED
      return newState
    default:
      return state
  }

} 

var state: PinballState = defaultState
export function dispatch(action?: action): PinballState {
  state = pinballReducer(state, action)
  return state
}