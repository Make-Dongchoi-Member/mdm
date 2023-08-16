import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { GameReadyDTO } from './dto/GameReady.dto';
import { GameRoomDTO } from './dto/GameRoom.dto';
import { GameRoomManager } from './objects/game.RoomManager';
import { Bar, GameStatus, Player } from 'src/types/interfaces';
import { GameStartDTO } from './dto/GameStart.dto';
import { GameBarDTO } from './dto/GameBar.dto';
import { GameState, UserState } from 'src/types/enums';
import { GameEndDTO } from './dto/GameEnd.dto';
import {
  BAR_BASIC_H,
  BAR_HARD_H,
  CANVAS_HEIGHT,
  FRAME_PER_MS,
  GAME_LIFE,
} from 'src/configs/constants';
import { GameMatchOutDTO } from './dto/GameMatchOut.dto';
import { GamePlayDTO } from './dto/GamePlay.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer() io: Server;
  gameManager: GameRoomManager = new GameRoomManager();
  constructor(private readonly gameService: GameService) {}
  // queue

  async handleDisconnect(client: Socket) {
    // 게임 서버가 들고있는 유저 정보 삭제하기
    if (this.gameManager.hasQueueBySocketId(client.id)) {
      // 큐에 들어있는 경우 아직 매칭되지 않은 유저
      this.gameManager.deletePlayerAtQueueBySocketId(client.id);
    } else {
      // 큐에 없는 경우 ready하지 않았거나, 게임 진행중이던 유저
      // 게임 진행중이던 유저인 경우 roomKey가 존재함
      const roomKey = this.gameService.getRoomKeyBySocketId(client.id);
      if (roomKey) {
        const gameStatus = this.gameService.getGameStatusByKey(roomKey);
        const gamePlayInfo = this.gameService.gamePlayByGameStatus(gameStatus);
        this.gameService.deleteAbortedGame(
          client.id,
          roomKey,
          this.gameManager,
          gameStatus,
        );
        this.io.to(roomKey).emit('game/end', gamePlayInfo);
        client.leave(roomKey);
      }
    }
  }

  @SubscribeMessage('game/match')
  handleGameMatch(client: Socket, data: GameReadyDTO) {
    if (!this.existPlayer(data.nickname)) {
      this.gameManager.enqueue({
        socket: client,
        bar: this.gameService.barSetter(data),
        life: GAME_LIFE,
        nickname: data.nickname,
      });
    }

    // 큐 안에 두 명 이상 들어온 경우
    if (this.gameManager.isMatched()) {
      // 게임방 번호(키) 생성
      const key: string = this.gameManager.newGameRoomKey();

      // 플레이어 두 명 큐에서 dequeue
      const playerA: Player = this.gameManager.dequeue();
      const playerB: Player = this.gameManager.dequeue();

      // 두 플레이어를 게임방에 join
      playerA.socket.join(key);
      playerB.socket.join(key);

      // 두 플레이어의 현재 상태를 '게임 중' 으로 변경
      this.gameService.setUserState(playerA.nickname, UserState.GAMING);
      this.gameService.setUserState(playerB.nickname, UserState.GAMING);

      // 두 플레이어에게 emitd
      const gameRoom: GameRoomDTO = {
        playerA: playerA.nickname,
        playerB: playerB.nickname,
        roomKey: key,
      };
      this.gameService.saveGameRoom(gameRoom.roomKey, playerA, playerB);
      this.io.to(key).emit('game/room', gameRoom);
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
        FRAME_PER_MS,
        data.roomKey,
        this.gameService,
        this.io,
        this.gameManager,
      );
      this.gameManager.saveIntervalID(data.roomKey, id);
    }
    this.gameService.setGameState(data.roomKey, GameState.GAMING);
  }

  // 게임 중간에 나간 사용자만d
  @SubscribeMessage('game/end')
  handleGameEnd(client: Socket, data: GameEndDTO) {
    // gmae 도중 사용자가 나갔을 때d
    // gameEnd로 설정
    // interval, roomKey, gameStatus 삭제
    const gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
    const gamePlayInfo = this.gameService.gamePlayByGameStatus(gameStatus);
    clearInterval(this.gameManager.getIntervalID(data.roomKey));
    if (gameStatus.playerA.nickname === data.nickname) {
      gameStatus.playerA.life = 0;
      this.gameService.saveGameToDB(
        gameStatus.playerB.nickname,
        gameStatus.playerA.nickname,
      );
    } else {
      gameStatus.playerB.life = 0;
      this.gameService.saveGameToDB(
        gameStatus.playerA.nickname,
        gameStatus.playerB.nickname,
      );
    }
    this.gameService.setUserState(
      gameStatus.playerA.nickname,
      UserState.ONLINE,
    );
    this.gameService.setUserState(
      gameStatus.playerB.nickname,
      UserState.ONLINE,
    );
    this.gameManager.deleteGameRoomKey(data.roomKey);
    this.gameService.deleteGameStatus(data.roomKey);
    this.io.to(data.roomKey).emit('game/end', gamePlayInfo);
    client.leave(data.roomKey);
  }

  // 게임이 종료되면 둘 다
  @SubscribeMessage('game/roomout')
  handleGameRoomOut(client: Socket, data: GameEndDTO) {
    // game 종료후 사용자가 속한 room 제거 요청
    client.leave(data.roomKey);
  }

  @SubscribeMessage('game/matchout')
  handleGameMatchOut(client: Socket, data: GameMatchOutDTO) {
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
    // console.log(gs, io)
    gs.play(roomKey);
    const gameStatus = gs.getGameStatusByKey(roomKey);
    const gamePlayInfo = gs.gamePlayByGameStatus(gameStatus);
    if (gameStatus.state === GameState.GAMING) {
      io.to(roomKey).emit('game/play', gamePlayInfo);
    } else if (gameStatus.state === GameState.PAUSE) {
      io.to(roomKey).emit('game/play', gamePlayInfo);
      if (gameStatus.playerA.life === 0 || gameStatus.playerB.life === 0) {
        clearInterval(gm.getIntervalID(roomKey));
        // gs.setGameState(roomKey, GameState.END);
        if (gameStatus.playerA.life === 0) {
          gs.saveGameToDB(
            gameStatus.playerB.nickname,
            gameStatus.playerA.nickname,
          );
        } else {
          gs.saveGameToDB(
            gameStatus.playerA.nickname,
            gameStatus.playerB.nickname,
          );
        }
        gs.setUserState(gameStatus.playerA.nickname, UserState.ONLINE);
        gs.setUserState(gameStatus.playerB.nickname, UserState.ONLINE);
        gm.deleteGameRoomKey(roomKey);
        gs.deleteGameStatus(roomKey);
        io.to(roomKey).emit('game/end', gamePlayInfo);
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
