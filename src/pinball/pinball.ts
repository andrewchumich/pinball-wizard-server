var sqlite3 = require('sqlite3').verbose()
import { User } from '../user'
import { PinballConfig } from './pinballConfig.interface'
import * as Gpio from '../gpio'
import { PinballState } from './PinballState.interface'
import { dispatch, SET_SCORE, SET_USER, END_GAME, START_GAME } from './pinball.reducer'
import { UserStorage, getUserStorage } from '../user'

// initialize state
var state = dispatch()

// dummy config
var initialConfig: PinballConfig = {
  onStateChange: (state: PinballState) => {
    console.log('STATE CHANGED', state)
  }
}


// the config that will actuall be used
var currentConfig: PinballConfig = Object.assign({}, initialConfig)

// on game start, listen to GPIO outputs
export const start = function start() {
  var gpioConfig: Gpio.GpioInterface = {
    onGameStart: () => {
      console.log('GAME START')
      state = dispatch({
        type: START_GAME
      })
      currentConfig.onStateChange(state)
    },
    onGameEnd: () => {
      console.log('GAME END')
      state = dispatch({
        type: END_GAME
      })
      currentConfig.onStateChange(state)
    },
    onScoreUpdate: (score: number) => {
      state = dispatch({
        type: SET_SCORE,
        payload: state.score.score + score
      })
      currentConfig.onStateChange(state)
    },
  }

  Gpio.start(gpioConfig)
}

export const setConfig = function listen(config: PinballConfig) {
  currentConfig = config;
}

export const setUser = function setUser(name: string=''): Promise<User> {
    return getUserStorage().get(name).then((user: User) => {
      state = dispatch({
        type: SET_USER,
        payload: user
      })
    }, (err) => {
      return getUserStorage().add(new User({ name }))
    })
}