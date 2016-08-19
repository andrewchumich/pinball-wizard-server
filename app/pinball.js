
var score = {
  score: 10,
  user: ''
};

const SCORES = [1, 10, 50, 100];

// should probably turn these into event listeners
var masterConfig = {
  onGameStart: () => console.log('GAME START'),
  onGameEnd: () => console.log('GAME END'),
  onScoreUpdate: (score) => console.log('SCORE:', score)
}


var timeoutFunction = function() {
    Math.random
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

exports.listen = function(config) {
  masterConfig = Object.assign({}, masterConfig, config);
};

exports.setUser = function(user='') {
  score.user = user;
}