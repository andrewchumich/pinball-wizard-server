
let score = {
  score: 10,
  user: ''
};
// config:
// {
//    onScoreUpdate: function() ...,
//    onGameEnd: function() ...,
// }
exports.start = function(config) {
  setInterval(() => {
    if (typeof config.onScoreUpdate === 'function') {
      score.score += Math.floor(Math.random() * 10);
      config.onScoreUpdate(score);
    }
  }, 2000);

  setTimeout(() => {
    if (typeof config.onGameEnd === 'function') {
      config.onGameEnd(score);
    }
  }, 100000);
}

exports.setUser = function(user='') {
  score.user = user;
}