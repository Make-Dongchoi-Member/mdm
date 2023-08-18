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
import { Player } from 'src/types/interfaces';
import { GameStartDTO } from './dto/GameStart.dto';
import { GameBarDTO } from './dto/GameBar.dto';
import { GameState, UserState } from 'src/types/enums';
import { GameEndDTO } from './dto/GameEnd.dto';
import { FRAME_PER_MS, GAME_LIFE } from 'src/configs/constants';
import { GameMatchOutDTO } from './dto/GameMatchOut.dto';

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
        this.io.to(roomKey).emit('game/quit', gamePlayInfo);
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

      // 매칭된 게임 정보(플레이어 두 명과 키)를 서버에 저장
      this.gameService.saveGameRoom(key, playerA, playerB);

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
      this.io.to(key).emit('game/room', gameRoom);
    }
  }

  @SubscribeMessage('game/start')
  handleGameStart(client: Socket, data: GameStartDTO) {
    // 서버에 저장해뒀던 게임 정보를 소켓 룸 키를 이용해 불러오기d
    const gameStatus = this.gameService.getGameStatusByKey(data.roomKey);

    // 방장 플레이어의 닉네임으로 온 요청이 아니라면 동작하지 않음
    if (data.nickname !== gameStatus.playerA.nickname) return;

    // 게임 상태를 GAMING 으로 변경
    this.gameService.setGameState(data.roomKey, GameState.GAMING);

    // 반복함수에 게임 엔진과 게임 정보 넘겨서 게임 진행d
    const id = setInterval(
      this.gameMain,
      FRAME_PER_MS,
      data.roomKey,
      this.gameService,
      this.io,
      this.gameManager,
    );

    // 반복함수 관리를 위해 해당 반복함수 ID를 소켓 룸 키와 함께 저장d
    this.gameManager.saveIntervalID(data.roomKey, id);
  }

  @SubscribeMessage('game/restart')
  handleGameRestart(client: Socket, data: GameStartDTO) {
    const gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
    if (data.nickname !== gameStatus.playerA.nickname) return;

    this.gameService.setGameState(data.roomKey, GameState.GAMING);

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

  @SubscribeMessage('game/revenge')
  handleGameRevenge(client: Socket, data: GameStartDTO) {
    const gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
    this.gameService.setNewGame(data.roomKey);

    if (gameStatus.playerA.nickname === data.nickname) {
      if (gameStatus.state === GameState.READY)
        this.gameService.setGameState(data.roomKey, GameState.GAMING);
      else this.gameService.setGameState(data.roomKey, GameState.READY);
    }
    if (gameStatus.playerB.nickname === data.nickname) {
      if (gameStatus.state === GameState.READY)
        this.gameService.setGameState(data.roomKey, GameState.GAMING);
      else this.gameService.setGameState(data.roomKey, GameState.READY);
    }
    if (gameStatus.state === GameState.GAMING) {
      this.io.to(data.roomKey).emit('game/pause', '3');
      setTimeout(() => {
        this.io.to(data.roomKey).emit('game/pause', '2');
        setTimeout(() => {
          this.io.to(data.roomKey).emit('game/pause', '1');
          // 게임 정보 세팅 및 반복함수 재등록
          setTimeout(() => {
            const id = setInterval(
              this.gameMain,
              FRAME_PER_MS,
              data.roomKey,
              this.gameService,
              this.io,
              this.gameManager,
            );
            this.gameManager.saveIntervalID(data.roomKey, id);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }

  // 게임 중간에 나간 사용자만
  @SubscribeMessage('game/quit')
  handleGameEnd(client: Socket, data: GameEndDTO) {
    // gmae 도중 사용자가 나갔을 때
    // gameEnd로 설정
    // interval, roomKey, gameStatus 삭제ㅇ
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
    this.io.to(data.roomKey).emit('game/quit', gamePlayInfo);
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
    // 소켓 룸 키를 받아서 실제 게임 계산 처리
    // 게임 상태가 이 함수에서 변경될 수 있음
    gs.play(roomKey);

    const gameStatus = gs.getGameStatusByKey(roomKey);
    const gamePlayInfo = gs.gamePlayByGameStatus(gameStatus);

    // 게임 상태가 GAMING인 경우에만 계산된 게임 정보를 클라이언트에게 emit
    if (gameStatus.state === GameState.GAMING) {
      io.to(roomKey).emit('game/play', gamePlayInfo);
    } else if (gameStatus.state === GameState.PAUSE) {
      clearInterval(gm.getIntervalID(roomKey));
      // 스코어 소진으로 인해 게임이 정상적으로 종료된 경우 처리
      if (gameStatus.playerA.life <= 0 || gameStatus.playerB.life <= 0) {
        // 게임 상태를 END로 변경
        gs.setGameState(roomKey, GameState.END);

        // 게임 결과 DB에 저장
        if (gameStatus.playerA.life <= 0) {
          gs.saveGameToDB(
            gameStatus.playerB.nickname,
            gameStatus.playerA.nickname,
          );
        } else if (gameStatus.playerB.life <= 0) {
          gs.saveGameToDB(
            gameStatus.playerA.nickname,
            gameStatus.playerB.nickname,
          );
        }
        // 진행되고 있던 게임이 종료되었다는 정보를 클라이언트에게 emit, 게임 상태 END
        io.to(roomKey).emit('game/end', gamePlayInfo);
      } else {
        // 일시 정지된 게임 정보를 클라이언트에게 emit, 게임 상태 PAUSE
        gs.setGame(roomKey);
        io.to(roomKey).emit('game/play', gamePlayInfo);

        // 1초에 한 번 씩 시간정보를 emit, 3번 반복
        io.to(roomKey).emit('game/pause', '3');
        setTimeout(() => {
          io.to(roomKey).emit('game/pause', '2');
          setTimeout(() => {
            io.to(roomKey).emit('game/pause', '1');
            // 게임 정보 세팅 및 반복함수 재등록
            setTimeout(() => {
              io.to(roomKey).emit('game/pause', '0');
            }, 1000);
          }, 1000);
        }, 1000);
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
