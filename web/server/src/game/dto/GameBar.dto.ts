import { GameStartDTO } from './GameStart.dto';

//export class GameStartDTO {
//  nickname: string;
//  roomKey: string;
//}

export class GameBarDTO extends GameStartDTO {
  pos: number;
}
