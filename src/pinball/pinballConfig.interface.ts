import { pinballState } from './pinballState.interface'

export interface PinballConfig {
  onStateChange: (pinballState) => any
}