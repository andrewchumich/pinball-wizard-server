export interface GpioInterface {
  onGameStart: () => void;
  onGameEnd: () => void;
  onScoreUpdate: (score: number) => void;
}
