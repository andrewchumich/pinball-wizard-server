import { status } from './status.enum'
import { User } from '../user'

export interface pinballState {
  score: number,
  user: User,
  status: status
}