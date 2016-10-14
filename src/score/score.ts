import { User } from '../user';

export class Score {
  score: number;
  user: User;

  constructor(score: { score: number, user: User } = { score: 0, user: new User() }) {
    this.score = score.score;
    this.user = score.user;
  }

  toApi(): any {
    return {
      score: this.score,
      user: this.user,
    };
  }
}