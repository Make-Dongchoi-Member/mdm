import { Injectable } from '@nestjs/common';
import {
  BALL_SIZE,
  BALL_SPEED,
  BAR_BASIC_H,
  BAR_HARD_H,
  BAR_W,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GAME_LIFE,
} from 'src/configs/constants';

import { RoomRepository } from 'src/database/repositories/room.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { GameState, UserState } from 'src/types/enums';
import { Ball, Bar, GameStatus, Player } from 'src/types/interfaces';
import { GameRoomDTO } from './dto/GameRoom.dto';
import { GameHistory } from 'src/database/entities/game-history.entity';
import { GameRoomManager } from './objects/game.RoomManager';
import { clearInterval } from 'timers';
import { GameReadyDTO } from './dto/GameReady.dto';
import { GamePlayDTO } from './dto/GamePlay.dto';

@Injectable()
export class GameService {
  private gameRoomStatusMap = new Map<string, GameStatus>();

  constructor(
    private roomRepository: RoomRepository,
    private userRepository: UserRepository,
  ) {}

  saveGameRoom(roomKey: string, playerA: Player, playerB: Player) {
    if (this.gameRoomStatusMap.has(roomKey)) throw new Error();

    const ball: Ball = {
      x: (CANVAS_WIDTH - BALL_SIZE) / 2,
      y: (CANVAS_HEIGHT - BALL_SIZE) / 2,
      speedX: BALL_SPEED,
      speedY: BALL_SPEED,
    };

    const gameStatus: GameStatus = {
      ball: ball,
      state: GameState.READY,
      playerA: playerA,
      playerB: playerB,
    };
    this.gameRoomStatusMap.set(roomKey, gameStatus);
  }

  setGame(socketRoom: string) {
    const gameStatus = this.gameRoomStatusMap.get(socketRoom);
    const ball: Ball = {
      x: (CANVAS_WIDTH - BALL_SIZE) / 2,
      y: (CANVAS_HEIGHT - BALL_SIZE) / 2,
      speedX: BALL_SPEED,
      speedY: BALL_SPEED,
    };
    gameStatus.ball = ball;
    this.gameRoomStatusMap.set(socketRoom, gameStatus);
  }

  setGameState(socketRoom: string, state: GameState) {
    const gameStatus = this.gameRoomStatusMap.get(socketRoom);
    gameStatus.state = state;
    this.gameRoomStatusMap.set(socketRoom, gameStatus);
  }

  play(socketRoom: string) {
    const gameStatus = this.gameRoomStatusMap.get(socketRoom);
    if (gameStatus.state !== GameState.GAMING) return;

    const ball = gameStatus.ball;
    const barA = gameStatus.playerA.bar;
    const barB = gameStatus.playerB.bar;

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // console.log(ball, barA, barB);

    //공이 왼쪽 벽에 부딪혔을 때의 조건
    if (ball.x < 0) {
      // console.log('left wall');
      gameStatus.playerA.life = gameStatus.playerA.life - 1;
      gameStatus.state = GameState.PAUSE;
    }

    //공이 오른쪽 벽에 부딪혔을 때의 조건
    else if (ball.x > CANVAS_WIDTH - BALL_SIZE) {
      // console.log('right wall');
      gameStatus.playerB.life = gameStatus.playerB.life - 1;
      gameStatus.state = GameState.PAUSE;
    }

    //공이 위, 아래 벽에 부딪혔을 때의 조건
    else if (ball.y < 0 || ball.y > CANVAS_HEIGHT - BALL_SIZE) {
      // console.log('up down wall');
      ball.speedY *= -1;
    }

    //공이 왼쪽 막대에 부딪혔을 때의 조건
    else if (
      ball.x < BAR_W &&
      ball.x > 0 &&
      ball.y < barA.y + barA.h &&
      ball.y > barA.y
    ) {
      // console.log('left bar');
      if (ball.speedX < 0) {
        ball.speedX = this.randomSpeed();
        if (ball.speedY < 0) {
          ball.speedY = this.randomSpeed() * -1;
        } else {
          ball.speedY = this.randomSpeed();
        }
      }
    }

    //공이 오른쪽 막대에 부딪혔을 때의 조건
    else if (
      ball.x > CANVAS_WIDTH - BAR_W - BALL_SIZE &&
      ball.x < CANVAS_WIDTH &&
      ball.y < barB.y + barB.h &&
      ball.y > barB.y
    ) {
      // console.log('right bar');
      if (ball.speedX > 0) {
        ball.speedX = this.randomSpeed() * -1;
        if (ball.speedY < 0) {
          ball.speedY = this.randomSpeed() * -1;
        } else {
          ball.speedY = this.randomSpeed();
        }
      }
    }

    this.gameRoomStatusMap.set(socketRoom, gameStatus);
    // emit
  }

  getGameStatusByKey(socketRoom: string): GameStatus {
    return this.gameRoomStatusMap.get(socketRoom);
  }

  barPosition(socketRoom: string, pos: number, nickname: string) {
    const gameStatus = this.gameRoomStatusMap.get(socketRoom);
    if (!gameStatus) return;
    const isLeft = gameStatus.playerA.nickname === nickname;
    if (isLeft) {
      gameStatus.playerA.bar.y += pos;
    } else {
      gameStatus.playerB.bar.y += pos;
    }
    // console.log(gameStatus);
    this.gameRoomStatusMap.set(socketRoom, gameStatus);
  }

  deleteGameStatus(socketRoom: string) {
    if (this.gameRoomStatusMap.has(socketRoom)) {
      this.gameRoomStatusMap.delete(socketRoom);
    }
  }

  hasPlayer(nickname: string): boolean {
    for (const [key, value] of this.gameRoomStatusMap) {
      if (
        value.playerA.nickname === nickname ||
        value.playerB.nickname === nickname
      )
        return true;
    }
    return false;
  }

  gamePlayByGameStatus(gameStatus: GameStatus): GamePlayDTO {
    const gamePlayInfo: GamePlayDTO = {
      ball: gameStatus.ball,
      playerA: {
        bar: gameStatus.playerA.bar,
        life: gameStatus.playerA.life,
        nickname: gameStatus.playerA.nickname,
      },
      playerB: {
        bar: gameStatus.playerB.bar,
        life: gameStatus.playerB.life,
        nickname: gameStatus.playerB.nickname,
      },
    };
    return gamePlayInfo;
  }

  barSetter(info: GameReadyDTO): Bar {
    let bar: Bar;
    if (info.gameMode === 'hard') {
      bar = {
        y: (CANVAS_HEIGHT - BAR_HARD_H) / 2,
        h: BAR_HARD_H,
        color: info.barColor,
      };
    } else {
      bar = {
        y: (CANVAS_HEIGHT - BAR_BASIC_H) / 2,
        h: BAR_BASIC_H,
        color: info.barColor,
      };
    }
    return bar;
  }

  getRoomKeyBySocketId(socketId: string): string | null {
    for (const [key, value] of this.gameRoomStatusMap) {
      if (
        value.playerA.socket.id === socketId ||
        value.playerB.socket.id === socketId
      )
        return key;
    }
    return null;
  }

  deleteAbortedGame(
    socketId: string,
    roomKey: string,
    gm: GameRoomManager,
    gs: GameStatus,
  ) {
    const abortPlayer = this.getPlayerBySocketId(socketId);
    clearInterval(gm.getIntervalID(roomKey));
    if (gs.playerA.nickname === abortPlayer) {
      gs.playerA.life = 0;
      this.saveGameToDB(gs.playerB.nickname, gs.playerA.nickname);
    } else {
      gs.playerB.life = 0;
      this.saveGameToDB(gs.playerA.nickname, gs.playerB.nickname);
    }
    this.setUserState(gs.playerA.nickname, UserState.ONLINE);
    this.setUserState(gs.playerB.nickname, UserState.ONLINE);
    gm.deleteGameRoomKey(roomKey);
    this.deleteGameStatus(roomKey);
  }

  async setUserState(nickname: string, state: UserState) {
    const user = await this.userRepository.getUserByNickname(nickname);
    if (
      (state === UserState.GAMING && user.state === UserState.ONLINE) ||
      (state === UserState.ONLINE && user.state === UserState.GAMING)
    ) {
      this.userRepository.updateUser(user.id, { state: state });
    }
  }

  async saveGameToDB(winnerNickname: string, loserNickname: string) {
    const date = new Date();
    const winner = await this.userRepository.getUserByNickname(winnerNickname);
    const loser = await this.userRepository.getUserByNickname(loserNickname);
    const winnerHistory = this.userRepository.manager.create(GameHistory, {
      date,
      win: true,
      user: winner,
      enemy: loser,
    });
    const loserHistory = this.userRepository.manager.create(GameHistory, {
      date,
      win: false,
      user: loser,
      enemy: winner,
    });
    await this.userRepository.manager.save([winnerHistory, loserHistory]);
  }

  private randomSpeed(): number {
    return Math.random() + BALL_SPEED;
  }

  private getPlayerBySocketId(socketId: string): string {
    for (const [key, value] of this.gameRoomStatusMap) {
      if (value.playerA.socket.id === socketId) return value.playerA.nickname;
      if (value.playerB.socket.id === socketId) return value.playerB.nickname;
    }
  }
}
