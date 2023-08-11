import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameDataDTO } from './dto/GameData.dto';
import { GameService } from './game.service';
import { GameReadyDTO } from './dto/GameReady.dto';
import { GameRoomDTO } from './dto/GameRoom.dto';
import { GameRoomManager } from './objects/game.RoomManager';
import { PlayerInfo } from 'src/types/interfaces';
import { GameStartDTO } from './dto/GameStart.dto';
import { GameBarDTO } from './dto/GameBar.dto';
import { GameState } from 'src/types/enums';
import { GAME_LIFE } from 'src/configs/constants';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class GameGateway {
  @WebSocketServer() io: Server;
  gameManager: GameRoomManager = new GameRoomManager();
  constructor(private readonly gameService: GameService) {}
  // queue

  @SubscribeMessage('game/match')
  handleGameMatch(client: Socket, data: GameReadyDTO) {
    this.gameManager.enqueue({ socket: client, nickname: data.nickname });

    // 큐 안에 두 명 이상 들어온 경우
    if (this.gameManager.isMatched()) {
      // 게임방 번호(키) 생성
      const key: string = this.gameManager.newGameRoomKey();

      // 플레이어 두 명 큐에서 dequeue
      const playerA: PlayerInfo = this.gameManager.dequeue();
      const playerB: PlayerInfo = this.gameManager.dequeue();

      // 두 플레이어를 게임방에 join
      playerA.socket.join(key);
      playerB.socket.join(key);

      // 두 플레이어에게 emit
      const gameRoom: GameRoomDTO = {
        playerA: playerA.nickname,
        playerB: playerB.nickname,
        roomKey: key,
      };
      this.gameService.saveGameRoom(gameRoom);
      this.io.to(key).emit('game/match', gameRoom);
    }
  }

  @SubscribeMessage('game/start')
  handleGameStart(client: Socket, data: GameStartDTO) {
    this.gameService.startGame(data.roomKey);
    const gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
    if (
      data.nickname === gameStatus.playerA.nickname &&
      gameStatus.playerA.life === GAME_LIFE &&
      gameStatus.playerB.life === GAME_LIFE
    )
      setInterval(this.gameMain, 5, data.roomKey, this.gameService, this.io);
  }

  @SubscribeMessage('game/bar')
  handleGameBarMove(client: Socket, data: GameBarDTO) {
    // console.log(data)
    this.gameService.barPosition(data.roomKey, data.pos, data.nickname);
  }

  private gameMain(roomKey: string, gs: GameService, io: Server) {
    // console.log(gs, io)
    gs.play(roomKey);
    const gmaeStatus = gs.getGameStatusByKey(roomKey);
    if (gmaeStatus.state === GameState.GAMING)
      io.to(roomKey).emit('game/play', gmaeStatus);
  }
}
