var sqlite3 = require('sqlite3').verbose();
import { Score } from '../score';
import { User } from '../user';
import { PinballConfig } from './pinballConfig.interface';
import * as Gpio from '../gpio';

try {
  var db = new sqlite3.Database('database/pinball-wizard.sqlite');
} catch (e) {
  console.log(e);
}

db.serialize(() => {
  db.all("SELECT * from users", (err, rows) => {
    console.log(rows);
  });
});

var score: Score = new Score();

const SCORES = [1, 10, 50, 100];

// should probably turn these into event listeners
var masterConfig: PinballConfig = {
  onGameStart: (score: Score) => console.log('GAME START'),
  onGameEnd: (score: Score) => console.log('GAME END'),
  onScoreUpdate: (score: Score) => console.log('SCORE:', score),
};

var timeoutFunction = function() {
    score.score += SCORES[Math.floor(Math.random() * 4)];

    masterConfig.onScoreUpdate(score);

    const randomTimeout = Math.random() * 5000;
    setTimeout(timeoutFunction, randomTimeout);
};

export const start = function() {
  // randomly increase score
  // this should eventually listen to the RaspberryPi inputs
  // probably form another module
  timeoutFunction();
  Gpio.start();
}

export const listen = function(config: PinballConfig) {
  masterConfig = Object.assign({}, masterConfig, config);
};

export const setUser = function(name: string='') {
  db.serialize(() => {
    db.get('SELECT id, name from users WHERE name = $name', {
      $name: name,
    }, (err, user) => {
      if (err !== null) {
        console.error('pinball::setUser error:', err);
      } else if (user === undefined) {
        console.log('No user:', name, 'need to create user');
      } else {
        score.user = new User(user);
      }
    });
  });
}