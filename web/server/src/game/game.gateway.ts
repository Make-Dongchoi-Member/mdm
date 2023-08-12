import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { GameReadyDTO } from './dto/GameReady.dto';
import { GameRoomDTO } from './dto/GameRoom.dto';
import { GameRoomManager } from './objects/game.RoomManager';
import { PlayerInfo } from 'src/types/interfaces';
import { GameStartDTO } from './dto/GameStart.dto';
import { GameBarDTO } from './dto/GameBar.dto';
import { GameState } from 'src/types/enums';
import { GameEndDTO } from './dto/GameEnd.dto';

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
    if (!this.existPlayer(data.nickname)) {
      this.gameManager.enqueue({ socket: client, nickname: data.nickname });
    }

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
      // console.log(key)
      this.io.to(key).emit('game/match', gameRoom);
    }
  }

  @SubscribeMessage('game/start')
  handleGameStart(client: Socket, data: GameStartDTO) {
    const gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
    if (data.nickname !== gameStatus.playerA.nickname) return;
    if (gameStatus.state === GameState.PAUSE) {
      this.gameService.setGame(data.roomKey);
    } else if (gameStatus.state === GameState.READY) {
      const id = setInterval(
        this.gameMain,
        4,
        data.roomKey,
        this.gameService,
        this.io,
        this.gameManager,
      );
      this.gameManager.saveIntervalID(data.roomKey, id);
    }
    this.gameService.setGameState(data.roomKey, GameState.GAMING);
  }

  @SubscribeMessage('game/end')
  handleGameEnd(client: Socket, data: GameEndDTO) {
    // gmae 도중 사용자가 나갔을 때
    // gameEnd로 설정
    // interval, roomKey, gameStatus 삭제
    const gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
    clearInterval(this.gameManager.getIntervalID(data.roomKey));
    this.gameManager.deleteGameRoomKey(data.roomKey);
    this.gameService.deleteGameStatus(data.roomKey);
    if (gameStatus.playerA.nickname === data.nickname) {
      gameStatus.playerA.life = 0;
    } else {
      gameStatus.playerB.life = 0;
    }
    this.io.to(data.roomKey).emit('game/end', gameStatus);
    client.leave(data.roomKey);
  }

  @SubscribeMessage('game/roomout')
  handleGameRoomOut(client: Socket, data: GameEndDTO) {
    // game 종료후 사용자가 속한 room 제거 요청
    client.leave(data.roomKey);
  }

  @SubscribeMessage('game/matchout')
  handleGameMatchOut(client: Socket, data: GameReadyDTO) {
    // 대기큐에서 삭제
    this.gameManager.deletePlayerAtQueue(data.nickname);
    if (!this.gameManager.hasQueue(data.nickname)) {
      client.emit('game/matchout');
    }
  }

  @SubscribeMessage('game/bar')
  handleGameBarMove(client: Socket, data: GameBarDTO) {
    // console.log(data
    this.gameService.barPosition(data.roomKey, data.pos, data.nickname);
  }

  private gameMain(
    roomKey: string,
    gs: GameService,
    io: Server,
    gm: GameRoomManager,
  ) {
    // console.log(gs, io
    gs.play(roomKey);
    const gameStatus = gs.getGameStatusByKey(roomKey);
    if (gameStatus.state === GameState.GAMING) {
      io.to(roomKey).emit('game/play', gameStatus);
    } else if (gameStatus.state === GameState.PAUSE) {
      io.to(roomKey).emit('game/play', gameStatus);
      if (gameStatus.playerA.life === 0 || gameStatus.playerB.life === 0) {
        clearInterval(gm.getIntervalID(roomKey));
        // gs.setGameState(roomKey, GameState.END);
        gm.deleteGameRoomKey(roomKey);
        gs.deleteGameStatus(roomKey);
        io.to(roomKey).emit('game/end', gameStatus);
      }
    }
  }

  private existPlayer(nickname: string): boolean {
    return (
      this.gameManager.hasQueue(nickname) ||
      this.gameService.hasPlayer(nickname)
    );
  }
}