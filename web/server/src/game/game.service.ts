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

@Injectable()
export class GameService {
  private gameRoomMap = new Map<string, GameStatus>();

  constructor(
    private roomRepository: RoomRepository,
    private userRepository: UserRepository,
  ) {}

  saveGameRoom(socketRoom: string) {
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
    const barB = barA;
    const gameStatus: GameStatus = {
      ball,
      barA,
      barB,
      state: GameState.READY,
      lifeA: GAME_LIFE,
      lifeB: GAME_LIFE,
    };
    this.gameRoomMap.set(socketRoom, gameStatus);
  }

  play(socketRoom: string) {
    const gameStatus = this.gameRoomMap.get(socketRoom);
    if (gameStatus.state !== GameState.GAMING) return;

    const ball = gameStatus.ball;
    const barA = gameStatus.barA;
    const barB = gameStatus.barB;

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    //공이 왼쪽 벽에 부딪혔을 때의 조건
    if (ball.x < 0) {
      --gameStatus.lifeA;
      gameStatus.state = GameState.READY;
    }

    //공이 오른쪽 벽에 부딪혔을 때의 조건
    if (ball.x > CANVAS_WIDTH - BALL_SIZE) {
      --gameStatus.lifeB;
      gameStatus.state = GameState.READY;
    }

    //공이 위, 아래 벽에 부딪혔을 때의 조건
    if (ball.y < 0 || ball.y > CANVAS_WIDTH - BALL_SIZE) {
      ball.speedY *= -1;
    }

    //공이 왼쪽 막대에 부딪혔을 때의 조건
    if (
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
    if (
      ball.x > CANVAS_WIDTH - BAR_W &&
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

    this.gameRoomMap.set(socketRoom, gameStatus);
    // emit
  }

  barPosition(socketRoom: string, pos: number, isLeft: boolean) {
    const gameStatus = this.gameRoomMap.get(socketRoom);
    if (isLeft) {
      gameStatus.barA.y += pos;
    } else {
      gameStatus.barB.y += pos;
    }
    this.gameRoomMap.set(socketRoom, gameStatus);
  }

  private randomSpeed(): number {
    return Math.random() + BALL_SPEED;
  }
}
