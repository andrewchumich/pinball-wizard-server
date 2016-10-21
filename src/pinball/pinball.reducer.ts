import { pinballState } from './pinballState.interface'
import { status } from './status.enum'


import { User } from '../user'
import { action } from '../reducers'

export const SET_SCORE = 'SET_SCORE'
export const SET_USER = 'SET_USER'
export const START_GAME = 'START_GAME'
export const END_GAME = 'END_GAME'

const defaultState: pinballState = {
  score: 0,
  user: new User(),
  status: status.STOPPED
}

export function pinballReducer(state: pinballState = defaultState, action: action = { type: '', payload: {} }): pinballState {
  var newState: pinballState
  switch (action.type) {
    case SET_SCORE:
      newState = Object.assign({}, state)
      newState.score = action.payload 
      return newState
    case SET_USER:
      newState = Object.assign({}, state)
      newState.user = action.payload
      return newState
    case START_GAME:
      newState = Object.assign({}, state)
      newState.status = status.RUNNING
      newState.score = 0
      return newState
    case END_GAME:
      newState = Object.assign({}, state)
      newState.status = status.STOPPED
      return newState
    default:
      return state
  }

} 

var state: pinballState = defaultState
export function dispatch(action?: action): pinballState {
  return pinballReducer(state, action)
}