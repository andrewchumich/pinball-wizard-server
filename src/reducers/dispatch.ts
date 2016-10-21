import { pinballReducer } from '../pinball'
import { action } from './action.interface'

const reducers = [
  {
    name: 'pinball',
    reducer: pinballReducer,
    state: pinballReducer()
  }
]

var state = {
  pinball: pinballReducer()
}

export function dispatch(action?: action) {

  return reducers.map((reducer) => {
    reducer.state = reducer.reducer(reducer.state, action)
    return reducer
  }).reduce((prev: any, current) => {
    prev[current.name] = current.state
  }, {})
}