var sqlite3 = require('sqlite3').verbose()
import { Score } from '../score'
import { User } from '../user'
import { PinballConfig } from './pinballConfig.interface'
import * as Gpio from '../gpio'

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

var score: Score = new Score()

const SCORES = [1, 10, 50, 100]

// the master config that will be used when creating new configs
// These functions are what should happen no matter what
var masterConfig: PinballConfig = {
  onGameStart: (score: Score) => console.log('GAME START'),
  onGameEnd: (score: Score) => console.log('GAME END'),
  onScoreUpdate: (s: Score) => {
    console.log('SCORE:', score)
    score = s
  },
}


// the config that will actuall be used
var currentConfig: PinballConfig = Object.assign({}, masterConfig)

export const start = function start() {
  // randomly increase score
  // this should eventually listen to the RaspberryPi inputs
  // probably form another module
  var gpioConfig: Gpio.GpioInterface = {
    onScoreUpdate: (num: number) => {
      score.score += num
      currentConfig.onScoreUpdate(score)
    },
    onGameStart: () => {
      console.log('GPIO START')
    },
    onGameEnd: () => {
      console.log('GPIO END')
    }
  }

  Gpio.start(gpioConfig)
}

export const setConfig = function listen(config: PinballConfig) {
  currentConfig = {
    onGameStart: (score: Score) => {
      config.onGameStart(score)
      masterConfig.onGameStart(score)
    },
    onGameEnd: (score) => {
      config.onGameEnd(score)
      masterConfig.onGameStart(score)
    },
    onScoreUpdate: (score) => {
      config.onScoreUpdate(score)
      masterConfig.onScoreUpdate(score)
    }
  }
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
        score.user = new User(user)
      }
    })
  })
}