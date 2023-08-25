import { Injectable } from '@nestjs/common';
import {
  BALL_SIZE,
  BALL_SPEED,
  BAR_W,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GAME_LIFE,
} from 'src/configs/constants';
import { UserRepository } from 'src/database/repositories/user.repository';
import { GameState, UserState } from 'src/types/enums';
import { Ball, GameStatus, Player } from 'src/types/interfaces';
import { GameHistory } from 'src/database/entities/game-history.entity';
import { GameStore } from './game.store';
import { clearInterval } from 'timers';
import { GamePlayDTO } from './dto/GamePlay.dto';
import { GameRoomDTO } from './dto/GameRoom.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly gameStore: GameStore,
  ) {}

  saveGameRoom(roomKey: string, playerA: Player, playerB: Player) {
    if (this.gameStore.getStatusMap().has(roomKey)) throw new Error();

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
    this.gameStore.getStatusMap().set(roomKey, gameStatus);
  }

  setNewGame(roomKey: string) {
    const gameStatus = this.gameStore.getStatusMap().get(roomKey);
    const ball: Ball = {
      x: (CANVAS_WIDTH - BALL_SIZE) / 2,
      y: (CANVAS_HEIGHT - BALL_SIZE) / 2,
      speedX: BALL_SPEED,
      speedY: BALL_SPEED,
    };
    gameStatus.ball = ball;
    gameStatus.playerA.life = GAME_LIFE;
    gameStatus.playerB.life = GAME_LIFE;
    this.gameStore.getStatusMap().set(roomKey, gameStatus);
  }

  setGame(roomKey: string) {
    const gameStatus = this.gameStore.getStatusMap().get(roomKey);
    const ball: Ball = {
      x: (CANVAS_WIDTH - BALL_SIZE) / 2,
      y: (CANVAS_HEIGHT - BALL_SIZE) / 2,
      speedX: BALL_SPEED,
      speedY: BALL_SPEED,
    };
    gameStatus.ball = ball;
    this.gameStore.getStatusMap().set(roomKey, gameStatus);
  }

  setGameState(roomKey: string, state: GameState) {
    const gameStatus = this.gameStore.getStatusMap().get(roomKey);
    gameStatus.state = state;
    this.gameStore.getStatusMap().set(roomKey, gameStatus);
  }

  play(roomKey: string) {
    const gameStatus = this.gameStore.getStatusMap().get(roomKey);
    if (gameStatus.state !== GameState.GAMING) return;

    const ball = gameStatus.ball;
    const barA = gameStatus.playerA.bar;
    if (barA.y < 0) barA.y = 0;
    if (barA.y > CANVAS_HEIGHT - barA.h) barA.y = CANVAS_HEIGHT - barA.h;

    const barB = gameStatus.playerB.bar;
    if (barB.y < 0) barB.y = 0;
    if (barB.y > CANVAS_HEIGHT - barB.h) barB.y = CANVAS_HEIGHT - barB.h;

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    //공이 왼쪽 벽에 부딪혔을 때의 조건
    if (ball.x < 0) {
      gameStatus.playerA.life = gameStatus.playerA.life - 1;
      if (gameStatus.playerA.life === 0) {
        gameStatus.state = GameState.END;
      } else {
        gameStatus.state = GameState.PAUSE;
      }
    }

    //공이 오른쪽 벽에 부딪혔을 때의 조건
    else if (ball.x > CANVAS_WIDTH - BALL_SIZE) {
      gameStatus.playerB.life = gameStatus.playerB.life - 1;
      if (gameStatus.playerB.life === 0) {
        gameStatus.state = GameState.END;
      } else {
        gameStatus.state = GameState.PAUSE;
      }
    }

    //공이 위, 아래 벽에 부딪혔을 때의 조건
    else if (ball.y < 0 || ball.y > CANVAS_HEIGHT - BALL_SIZE) {
      ball.speedY *= -1;
    }

    //공이 왼쪽 막대에 부딪혔을 때의 조건
    else if (
      ball.x < BAR_W &&
      ball.x > 0 &&
      ball.y < barA.y + barA.h &&
      ball.y > barA.y
    ) {
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
      if (ball.speedX > 0) {
        ball.speedX = this.randomSpeed() * -1;
        if (ball.speedY < 0) {
          ball.speedY = this.randomSpeed() * -1;
        } else {
          ball.speedY = this.randomSpeed();
        }
      }
    }

    this.gameStore.getStatusMap().set(roomKey, gameStatus);
  }

  getGameStatusByKey(roomKey: string): GameStatus {
    return this.gameStore.getStatusMap().get(roomKey);
  }

  barPosition(roomKey: string, pos: number, nickname: string) {
    const gameStatus = this.gameStore.getStatusMap().get(roomKey);
    if (!gameStatus) return;
    const isLeft = gameStatus.playerA.nickname === nickname;
    if (isLeft) {
      gameStatus.playerA.bar.y += pos;
    } else {
      gameStatus.playerB.bar.y += pos;
    }
    this.gameStore.getStatusMap().set(roomKey, gameStatus);
  }

  deleteGameStatus(roomKey: string) {
    if (this.gameStore.getStatusMap().has(roomKey)) {
      this.gameStore.getStatusMap().delete(roomKey);
    }
  }

  hasPlayer(nickname: string): boolean {
    for (const [key, value] of this.gameStore.getStatusMap()) {
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
      state: gameStatus.state,
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

  getRoomKeyBySocketId(socketId: string): string | null {
    for (const [key, value] of this.gameStore.getStatusMap()) {
      if (
        value.playerA.socket.id === socketId ||
        value.playerB.socket.id === socketId
      )
        return key;
    }
    return null;
  }

  async deleteAbortedGame(
    socketId: string,
    roomKey: string,
    gm: GameStore,
    gs: GameStatus,
  ) {
    const abortPlayer = this.getPlayerBySocketId(socketId);
    clearInterval(gm.getIntervalID(roomKey));
    if (gs.playerA.nickname === abortPlayer) {
      gs.playerA.life = 0;
      await this.saveGameToDB(gs.playerB.nickname, gs.playerA.nickname);
    } else {
      gs.playerB.life = 0;
      await this.saveGameToDB(gs.playerA.nickname, gs.playerB.nickname);
    }
    gm.deleteGameRoomKey(roomKey);
    this.deleteGameStatus(roomKey);
  }

  async setUserState(playerA: string, playerB: string, state: UserState) {
    const userA = await this.userRepository.getUserByNickname(playerA);
    const userB = await this.userRepository.getUserByNickname(playerB);
    if (userA.state !== UserState.OFFLINE) userA.state = state;
    if (userB.state !== UserState.OFFLINE) userB.state = state;
    await this.userRepository.save([userA, userB]);
  }

  async saveGameToDB(winnerNickname: string, loserNickname: string) {
    const date = new Date();
    const winner = await this.userRepository.getUserByNicknameWithRecord(
      winnerNickname,
    );
    const loser = await this.userRepository.getUserByNicknameWithRecord(
      loserNickname,
    );
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

  async getUserByNickname(nickname: string) {
    return await this.userRepository.getUserByNickname(nickname);
  }

  async getUserById(id: number) {
    return await this.userRepository.getUserById(id);
  }

  getPrivateRoomKey(nickname: string): GameRoomDTO | null {
    return this.gameStore.getPrivateRoomKeyByNickname(nickname);
  }

  private randomSpeed(): number {
    return Math.random() + BALL_SPEED;
  }

  private getPlayerBySocketId(socketId: string): string {
    for (const [key, value] of this.gameStore.getStatusMap()) {
      if (value.playerA.socket.id === socketId) return value.playerA.nickname;
      if (value.playerB.socket.id === socketId) return value.playerB.nickname;
    }
  }
}
