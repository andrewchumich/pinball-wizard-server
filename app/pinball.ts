var sqlite3 = require('sqlite3').verbose();
import { Score } from './score';
import { User } from './user';

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

interface Config {
  onGameStart: (score: Score) => void;
  onGameEnd: (score: Score) => void;
  onScoreUpdate: (score: Score) => void;
}

// should probably turn these into event listeners
var masterConfig: Config = {
  onGameStart: (score: Score) => console.log('GAME START'),
  onGameEnd: (score: Score) => console.log('GAME END'),
  onScoreUpdate: (score: Score) => console.log('SCORE:', score),
};

var timeoutFunction = function() {
    score.score += SCORES[Math.floor(Math.random() * 4)];

    masterConfig.onScoreUpdate(score);

    const randomTimeout = Math.random() * 3000;
    setTimeout(timeoutFunction, randomTimeout);
};

// config:
// {
//    onScoreUpdate: function() ...,
//    onGameEnd: function() ...,
// }

exports.start = function() {
  // randomly increase score
  timeoutFunction();
}

exports.listen = function(config: Config) {
  masterConfig = Object.assign({}, masterConfig, config);
};

exports.setUser = function(name: string='') {
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