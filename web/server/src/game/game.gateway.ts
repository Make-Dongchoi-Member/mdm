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
import { GameStore } from './game.store';
import { Player } from 'src/types/interfaces';
import { GameStartDTO } from './dto/GameStart.dto';
import { GameBarDTO } from './dto/GameBar.dto';
import { GameState, UserState } from 'src/types/enums';
import { GameEndDTO } from './dto/GameEnd.dto';
import { FRAME_PER_MS, GAME_LIFE } from 'src/configs/constants';
import { GameMatchOutDTO } from './dto/GameMatchOut.dto';
import { GameUtil } from './game.util';
import { AlertDTO } from 'src/alert/dto/Alert.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer() io: Server;
  constructor(
    private readonly gameService: GameService,
    private readonly gameStore: GameStore,
    private readonly util: GameUtil,
  ) {}
  // queue

  async handleDisconnect(client: Socket) {
    let privateRoomKey: string = this.gameStore.getPrivateRoomKeyBySocketId(
      client.id,
    );
    // 게임 서버가 들고있는 유저 정보 삭제하기
    if (this.gameStore.hasQueueBySocketId(client.id)) {
      // 큐에 들어있는 경우 아직 매칭되지 않은 유저
      this.gameStore.deletePlayerAtQueueBySocketId(client.id);
    } else if (privateRoomKey) {
      console.log(privateRoomKey);
      // 프라이빗 큐에 들어있는놈 삭제
      this.gameStore.deletePrivateGame(privateRoomKey);
    } else {
      // 큐에 없는 경우 ready하지 않았거나, 게임이 이미 끝났거나, 재경기 대기 중이거나, 게임 진행중이던 유저
      // 게임 진행중이던 유저인 경우 roomKey가 존재함
      const roomKey = this.gameService.getRoomKeyBySocketId(client.id);
      if (roomKey) {
        const gameStatus = this.gameService.getGameStatusByKey(roomKey);
        const gamePlayInfo = this.gameService.gamePlayByGameStatus(gameStatus);

        if (
          gameStatus.state === GameState.GAMING ||
          gameStatus.state === GameState.PAUSE
        ) {
          this.gameService.deleteAbortedGame(
            client.id,
            roomKey,
            this.gameStore,
            gameStatus,
          );
          this.io.to(roomKey).emit('game/quit', gamePlayInfo);
        } else {
          // 게임 종료 후 재경기 대기 중에 이탈자 발생한 경우
          // 또는 게임 종료 후 추가 행동 없이 이탈한 경우
          // 게임 결과 저장하지 않고 게임 정보만 삭제
          this.gameStore.deleteGameRoomKey(roomKey);
          this.gameService.deleteGameStatus(roomKey);
          this.io.to(roomKey).emit('game/quit', gamePlayInfo);
        }
        this.gameService.setUserState(
          gameStatus.playerA.nickname,
          UserState.ONLINE,
        );
        this.gameService.setUserState(
          gameStatus.playerB.nickname,
          UserState.ONLINE,
        );
        this.sendStateToFriends(gameStatus.playerA.nickname, UserState.ONLINE);
        this.sendStateToFriends(gameStatus.playerB.nickname, UserState.ONLINE);

        client.leave(roomKey);
      }
    }
  }

  @SubscribeMessage('game/match')
  handleGameMatch(client: Socket, data: GameReadyDTO) {
    if (!this.existPlayer(data.nickname, data.roomId)) {
      this.gameStore.enqueue({
        socket: client,
        bar: this.util.barSetter(data),
        life: GAME_LIFE,
        nickname: data.nickname,
      });
    }

    // 큐 안에 두 명 이상 들어온 경우
    if (this.gameStore.isMatched()) {
      // 게임방 번호(키) 생성
      const key: string = this.gameStore.newGameRoomKey();

      // 플레이어 두 명 큐에서 dequeue
      const playerA: Player = this.gameStore.dequeue();
      const playerB: Player = this.gameStore.dequeue();

      // 매칭된 게임 정보(플레이어 두 명과 키)를 서버에 저장
      this.gameService.saveGameRoom(key, playerA, playerB);

      // 두 플레이어를 게임방에 join
      playerA.socket.join(key);
      playerB.socket.join(key);

      // 두 플레이어의 현재 상태를 '게임 중' 으로 변경
      this.gameService.setUserState(playerA.nickname, UserState.GAMING);
      this.gameService.setUserState(playerB.nickname, UserState.GAMING);
      this.sendStateToFriends(playerA.nickname, UserState.GAMING);
      this.sendStateToFriends(playerB.nickname, UserState.GAMING);

      // 두 플레이어에게 emitd
      const gameRoom: GameRoomDTO = {
        playerA: playerA.nickname,
        playerB: playerB.nickname,
        roomKey: key,
      };
      this.io.to(key).emit('game/room', gameRoom);
    }
  }

  @SubscribeMessage('game/private-match-deny')
  handlePrivateGameDeny(client: Socket, data: AlertDTO) {
    if (!this.gameStore.isPrivateGame(data.alert.roomId)) return;
    const sender = this.gameStore.getPrivateGame(data.alert.roomId);
    this.io.to(sender.socket.id).emit('game/private-match-deny', data);
    sender.socket.leave(data.alert.roomId);
  }

  @SubscribeMessage('game/private-match')
  handlePrivateGameMatch(client: Socket, data: AlertDTO) {
    if (!this.gameStore.isPrivateGame(data.alert.roomId)) return;

    const sender: Player = this.gameStore.getPrivateGame(data.alert.roomId);
    this.gameStore.deletePrivateGame(data.alert.roomId);

    // 두 플레이어를 게임방에 join
    sender.socket.join(data.alert.roomId);
    client.join(data.alert.roomId);

    // 두 플레이어의 현재 상태를 '게임 중' 으로 변경
    this.gameService.setUserState(data.alert.sender.nickname, UserState.GAMING);
    this.gameService.setUserState(
      data.alert.receiver.nickname,
      UserState.GAMING,
    );
    this.sendStateToFriends(data.alert.sender.nickname, UserState.GAMING);
    this.sendStateToFriends(data.alert.receiver.nickname, UserState.GAMING);

    // 두 플레이어에게 emitd
    const gameRoom: GameRoomDTO = {
      playerA: data.alert.sender.nickname,
      playerB: data.alert.receiver.nickname,
      roomKey: data.alert.roomId,
    };
    const receiver: Player = {
      bar: this.util.barSetter({
        nickname: data.alert.receiver.nickname,
        gameMode: data.alert.gameSetting.gameMode,
        barColor: data.alert.gameSetting.barColor,
      }),
      life: GAME_LIFE,
      nickname: data.alert.receiver.nickname,
      socket: client,
    };
    this.gameService.saveGameRoom(gameRoom.roomKey, sender, receiver);
    this.io.to(gameRoom.roomKey).emit('game/room', gameRoom);
  }

  @SubscribeMessage('game/start')
  handleGameStart(client: Socket, data: GameStartDTO) {
    // 서버에 저장해뒀던 게임 정보를 소켓 룸 키를 이용해 불러오기
    let gameStatus = this.gameService.getGameStatusByKey(data.roomKey);

    // 방장 플레이어의 닉네임으로 온 요청이 아니라면 동작하지 않음
    if (data.nickname !== gameStatus.playerA.nickname) return;

    // 게임 상태를 GAMING 으로 변경d
    this.gameService.setGameState(data.roomKey, GameState.GAMING);

    // 반복함수에 게임 엔진과 게임 정보 넘겨서 3초 후 게임 진행
    this.io.to(data.roomKey).emit('game/pause', '3');
    setTimeout(() => {
      gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
      if (!gameStatus) return;
      this.io.to(data.roomKey).emit('game/pause', '2');
      setTimeout(() => {
        gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
        if (!gameStatus) return;
        this.io.to(data.roomKey).emit('game/pause', '1');
        // 게임 정보 세팅 및 반복함수 재등록
        setTimeout(() => {
          gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
          if (!gameStatus) return;
          const id = setInterval(
            this.gameMain,
            FRAME_PER_MS,
            data.roomKey,
            this.gameService,
            this.io,
            this.gameStore,
          );
          this.gameStore.saveIntervalID(data.roomKey, id);
        }, 1000);
      }, 1000);
    }, 1000);
  }

  @SubscribeMessage('game/revenge')
  handleGameRevenge(client: Socket, data: GameStartDTO) {
    let gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
    this.gameService.setNewGame(data.roomKey);

    if (gameStatus.playerA.nickname === data.nickname) {
      if (gameStatus.state === GameState.READY) {
        this.gameService.setGameState(data.roomKey, GameState.GAMING);
      } else {
        this.gameService.setGameState(data.roomKey, GameState.READY);
      }
    }
    if (gameStatus.playerB.nickname === data.nickname) {
      if (gameStatus.state === GameState.READY) {
        this.gameService.setGameState(data.roomKey, GameState.GAMING);
      } else {
        this.gameService.setGameState(data.roomKey, GameState.READY);
      }
    }
    if (gameStatus.state === GameState.GAMING) {
      this.io.to(data.roomKey).emit('game/pause', '3');
      setTimeout(() => {
        gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
        if (!gameStatus) return;
        this.io.to(data.roomKey).emit('game/pause', '2');
        setTimeout(() => {
          gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
          if (!gameStatus) return;
          this.io.to(data.roomKey).emit('game/pause', '1');
          // 게임 정보 세팅 및 반복함수 재등록
          setTimeout(() => {
            gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
            if (!gameStatus) return;
            const id = setInterval(
              this.gameMain,
              FRAME_PER_MS,
              data.roomKey,
              this.gameService,
              this.io,
              this.gameStore,
            );
            this.gameStore.saveIntervalID(data.roomKey, id);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }

  // 게임 end 이후 그만 뒀을 때
  @SubscribeMessage('game/quit')
  handleGameQuit(client: Socket, data: GameEndDTO) {
    const gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
    if (!gameStatus) return;
    const gamePlayInfo = this.gameService.gamePlayByGameStatus(gameStatus);
    clearInterval(this.gameStore.getIntervalID(data.roomKey));
    this.gameService.setUserState(
      gameStatus.playerA.nickname,
      UserState.ONLINE,
    );
    this.gameService.setUserState(
      gameStatus.playerB.nickname,
      UserState.ONLINE,
    );
    this.sendStateToFriends(gameStatus.playerA.nickname, UserState.ONLINE);
    this.sendStateToFriends(gameStatus.playerB.nickname, UserState.ONLINE);
    this.gameStore.deleteGameRoomKey(data.roomKey);
    this.gameService.deleteGameStatus(data.roomKey);
    this.io.to(data.roomKey).emit('game/quit', gamePlayInfo);
    client.leave(data.roomKey);
  }

  // 게임 중간 이탈자 발생 시 처리하는 핸들러
  @SubscribeMessage('game/roomout')
  handleGameRoomOut(client: Socket, data: GameEndDTO) {
    const gameStatus = this.gameService.getGameStatusByKey(data.roomKey);
    const gamePlayInfo = this.gameService.gamePlayByGameStatus(gameStatus);
    clearInterval(this.gameStore.getIntervalID(data.roomKey));
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
    this.sendStateToFriends(gameStatus.playerA.nickname, UserState.ONLINE);
    this.sendStateToFriends(gameStatus.playerB.nickname, UserState.ONLINE);
    this.gameStore.deleteGameRoomKey(data.roomKey);
    this.gameService.deleteGameStatus(data.roomKey);
    this.io.to(data.roomKey).emit('game/quit', gamePlayInfo);
    client.leave(data.roomKey);
  }

  @SubscribeMessage('game/matchout')
  handleGameMatchOut(client: Socket, data: GameMatchOutDTO) {
    // 대기큐에서 삭제
    this.gameStore.deletePlayerAtQueue(data.nickname);
    if (!this.gameStore.hasQueue(data.nickname)) {
      client.emit('game/matchout');
    }
  }

  @SubscribeMessage('game/private-matchout')
  handleGamePrivateMatchOut(client: Socket, data: { roomKey: string }) {
    // 대기큐에서 삭제
    this.gameStore.deletePrivateGame(data.roomKey);
  }

  @SubscribeMessage('game/bar')
  handleGameBarMove(client: Socket, data: GameBarDTO) {
    this.gameService.barPosition(data.roomKey, data.pos, data.nickname);
  }

  private gameMain(
    roomKey: string,
    gs: GameService,
    io: Server,
    gm: GameStore,
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
      // 일시 정지된 게임 정보를 클라이언트에게 emit, 게임 상태 PAUSE
      gs.setGame(roomKey);
      io.to(roomKey).emit('game/play', gamePlayInfo);

      io.to(roomKey).emit('game/pause', 'restart');
    } else if (gameStatus.state === GameState.END) {
      clearInterval(gm.getIntervalID(roomKey));
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
    }
  }

  private existPlayer(nickname: string, roomId: string): boolean {
    return (
      this.gameStore.hasQueue(nickname) ||
      this.gameService.hasPlayer(nickname) ||
      this.gameStore.isPrivateGame(roomId)
    );
  }

  private async sendStateToFriends(nickname: string, state: UserState) {
    const user = await this.gameService.getUserByNickname(nickname);
    if (!user) return;
    let event: string;
    if (state === UserState.GAMING) {
      event = 'gaming';
    } else if (state === UserState.ONLINE) {
      event = 'online';
    }
    for (const iter of user.friends) {
      const friend = await this.gameService.getUserById(iter);
      if (friend.socket) {
        this.io.to(friend.socket).emit(event, { who: user.id });
      }
    }
  }
}
