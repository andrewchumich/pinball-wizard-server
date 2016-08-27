"use strict";
var sqlite3 = require('sqlite3').verbose();
const score_1 = require('./score');
const user_1 = require('./user');
try {
    var db = new sqlite3.Database('database/pinball-wizard.sqlite');
}
catch (e) {
    console.log(e);
}
db.serialize(() => {
    db.all("SELECT * from users", (err, rows) => {
        console.log(rows);
    });
});
var score = new score_1.Score();
const SCORES = [1, 10, 50, 100];
var masterConfig = {
    onGameStart: (score) => console.log('GAME START'),
    onGameEnd: (score) => console.log('GAME END'),
    onScoreUpdate: (score) => console.log('SCORE:', score),
};
var timeoutFunction = function () {
    score.score += SCORES[Math.floor(Math.random() * 4)];
    masterConfig.onScoreUpdate(score);
    const randomTimeout = Math.random() * 3000;
    setTimeout(timeoutFunction, randomTimeout);
};
exports.start = function () {
    timeoutFunction();
};
exports.listen = function (config) {
    masterConfig = Object.assign({}, masterConfig, config);
};
exports.setUser = function (name = '') {
    db.serialize(() => {
        db.get('SELECT id, name from users WHERE name = $name', {
            $name: name,
        }, (err, user) => {
            if (err !== null) {
                console.error('pinball::setUser error:', err);
            }
            else if (user === undefined) {
                console.log('No user:', name, 'need to create user');
            }
            else {
                score.user = new user_1.User(user);
            }
        });
    });
};
