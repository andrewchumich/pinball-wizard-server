
let score = {
  score: 10,
  user: ''
};
// config:
// {
//    onScoreUpdate: function() ...
// }
exports.start = function(config) {

  setInterval(() => {
    if (typeof config.onScoreUpdate === 'function') {
      config.onScoreUpdate(score);
    }
  }, 2000)
}

exports.setUser = function(user='') {
  score.user = user;
}