"use strict";
const user_1 = require('../user');
class Score {
    constructor(score = { score: 0, user: new user_1.User() }) {
        this.score = score.score;
        this.user = score.user;
    }
    toApi() {
        return {
            score: this.score,
            user: this.user.name,
        };
    }
}
exports.Score = Score;
