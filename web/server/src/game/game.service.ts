import { Injectable } from '@nestjs/common';
import {
  BALL_SIZE,
  BALL_SPEED,
  BAR_BASIC_H,
  BAR_W,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GAME_LIFE,
} from 'src/configs/constants';

import { RoomRepository } from 'src/database/repositories/room.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { GameState } from 'src/types/enums';
import { Ball, Bar, GameStatus, PlayerInfo } from 'src/types/interfaces';
import { GameRoomDTO } from './dto/GameRoom.dto';

@Injectable()
export class GameService {
  private gameRoomMap = new Map<string, GameStatus>();

  constructor(
    private roomRepository: RoomRepository,
    private userRepository: UserRepository,
  ) {}

  saveGameRoom(gameRoom: GameRoomDTO) {
    if (this.gameRoomMap.has(gameRoom.roomKey)) throw new Error();

    const ball: Ball = {
      x: (CANVAS_WIDTH - BALL_SIZE) / 2,
      y: (CANVAS_HEIGHT - BALL_SIZE) / 2,
      speedX: BALL_SPEED,
      speedY: BALL_SPEED,
    };
    const barA: Bar = {
      y: (CANVAS_HEIGHT - BAR_BASIC_H) / 2,
      h: BAR_BASIC_H,
    };
    const barB = {
      y: (CANVAS_HEIGHT - BAR_BASIC_H) / 2,
      h: BAR_BASIC_H,
    };
    const gameStatus: GameStatus = {
      ball,
      state: GameState.READY,
      playerA: {
        bar: barA,
        life: GAME_LIFE,
        nickname: gameRoom.playerA,
      },
      playerB: {
        bar: barB,
        life: GAME_LIFE,
        nickname: gameRoom.playerB,
      },
    };
    this.gameRoomMap.set(gameRoom.roomKey, gameStatus);
  }

  setGame(socketRoom: string) {
    const gameStatus = this.gameRoomMap.get(socketRoom);
    const ball: Ball = {
      x: (CANVAS_WIDTH - BALL_SIZE) / 2,
      y: (CANVAS_HEIGHT - BALL_SIZE) / 2,
      speedX: BALL_SPEED,
      speedY: BALL_SPEED,
    };
    gameStatus.ball = ball;
    this.gameRoomMap.set(socketRoom, gameStatus);
  }

  setGameState(socketRoom: string, state: GameState) {
    const gameStatus = this.gameRoomMap.get(socketRoom);
    gameStatus.state = state;
    this.gameRoomMap.set(socketRoom, gameStatus);
  }

  play(socketRoom: string) {
    const gameStatus = this.gameRoomMap.get(socketRoom);
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

    this.gameRoomMap.set(socketRoom, gameStatus);
    // emit
  }

  getGameStatusByKey(socketRoom: string): GameStatus {
    return this.gameRoomMap.get(socketRoom);
  }

  barPosition(socketRoom: string, pos: number, nickname: string) {
    const gameStatus = this.gameRoomMap.get(socketRoom);
    const isLeft = gameStatus.playerA.nickname === nickname;
    if (isLeft) {
      gameStatus.playerA.bar.y += pos;
    } else {
      gameStatus.playerB.bar.y += pos;
    }
    // console.log(gameStatus);
    this.gameRoomMap.set(socketRoom, gameStatus);
  }

  deleteGameStatus(socketRoom: string) {
    if (this.gameRoomMap.has(socketRoom)) {
      this.gameRoomMap.delete(socketRoom);
    }
  }

  hasPlayer(nickname: string): boolean {
    for (const [key, value] of this.gameRoomMap) {
      if (
        value.playerA.nickname === nickname ||
        value.playerB.nickname === nickname
      )
        return true;
    }
    return false;
  }

  private randomSpeed(): number {
    return Math.random() + BALL_SPEED;
  }
}
