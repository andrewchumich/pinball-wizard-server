import { User } from '../user'

export class Score {
  public score: number
  public user: User

  constructor(score: { score: number, user: User } = { score: 0, user: undefined }) {
    if (!score.user) {
      console.error('Score::constructor -- Score constructor requires a User object')
    }

    this.score = score.score
    this.user = score.user
  }
  
}