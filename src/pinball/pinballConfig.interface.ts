import { Score } from '../score';

export interface PinballConfig {
  onGameStart: (score: Score) => void;
  onGameEnd: (score: Score) => void;
  onScoreUpdate: (score: Score) => void;
}