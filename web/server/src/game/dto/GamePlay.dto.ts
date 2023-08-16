import { GameState } from 'src/types/enums';
import { Ball, PlayerInfo } from 'src/types/interfaces';

export class GamePlayDTO {
  ball: Ball;
  state: GameState;
  playerA: PlayerInfo;
  playerB: PlayerInfo;
}
