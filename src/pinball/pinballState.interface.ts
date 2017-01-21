import { status } from './status.enum'
import { User } from '../user'
import { Score } from '../score'

export interface PinballState {
  score: Score
  status: status
}