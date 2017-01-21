import { PinballState } from './pinballState.interface'

export interface PinballConfig {
  onStateChange: (pinballState: PinballState) => any
}