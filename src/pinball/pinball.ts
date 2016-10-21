var sqlite3 = require('sqlite3').verbose()
import { User } from '../user'
import { PinballConfig } from './pinballConfig.interface'
import * as Gpio from '../gpio'
import { pinballState } from './pinballState.interface'
import { dispatch, SET_SCORE, SET_USER, END_GAME, START_GAME } from './pinball.reducer'
try {
  var db = new sqlite3.Database('database/pinball-wizard.sqlite')
} catch (e) {
  console.log(e)
}

db.serialize(() => {
  db.all("SELECT * from users", (err, rows) => {
    console.log(rows)
  })
})

// initialize state
var state = dispatch()

// dummy config
var initialConfig: PinballConfig = {
  onStateChange: (state: pinballState) {
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
        payload: state.score + score
      })
      currentConfig.onStateChange(state)
    },
  }

  Gpio.start(gpioConfig)
}

export const setConfig = function listen(config: PinballConfig) {
  currentConfig = config;
}

export const setUser = function setUser(name: string='') {
  db.serialize(() => {
    db.get('SELECT id, name from users WHERE name = $name', {
      $name: name || 'ALC',
    }, (err, user) => {
      if (err !== null) {
        console.error('pinball::setUser error:', err)
      } else if (user === undefined) {
        console.log('No user:', name, 'need to create user')
      } else {
        state.user = new User(user)
      }
    })
  })
}