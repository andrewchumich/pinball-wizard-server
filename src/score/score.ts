import { User } from '../user'

export class Score {
  score: number
  user: User

  constructor(score: { score: number, user: User } = { score: 0, user: new User() }) {
    this.score = score.score
    this.user = score.user
  }

  setScore(score: number): Score {
    this.score = score
    return this
  }

  toApi(): any {
    return {
      score: this.score,
      user: this.user,
    };
  }
}