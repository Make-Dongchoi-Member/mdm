import { Injectable } from '@nestjs/common';
import {
  BALL_SIZE,
  BALL_SPEED,
  BAR_BASIC_H,
  BAR_W,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from 'src/configs/constants';

import { RoomRepository } from 'src/database/repositories/room.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { GameState } from 'src/types/enums';
import { Ball, Bar, GameStatus } from 'src/types/interfaces';

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
    };
    const barB = barA;
    const gameStatus: GameStatus = {
      ball,
      barA,
      barB,
      state: GameState.READY,
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

    if (ball.x > CANVAS_WIDTH - BALL_SIZE) {
      ball.speedX = this.randomSpeed() * -1;
      if (ball.speedY < 0) {
        ball.speedY = this.randomSpeed() * -1;
      } else {
        ball.speedY = this.randomSpeed();
      }
    }
    if (ball.y < 0 || ball.y > CANVAS_WIDTH - BALL_SIZE) {
      ball.speedY *= -1;
    }
    if (
      ball.x < BAR_W &&
      ball.x > BAR_W &&
      ball.y < bar.y + bar.h &&
      ball.y > bar.y
    ) {
      if (ball.speedX < 0) {
        gameState.myScore++;
        scoreDiv.innerText = `${gameState.myScore} : ${gameState.enemyScore}`;
        ball.speedX = randomSpeed();
        if (ball.speedY < 0) {
          ball.speedY = randomSpeed() * -1;
        } else {
          ball.speedY = randomSpeed();
        }
      }
    }
  }

  private randomSpeed(): number {
    return Math.random() + BALL_SPEED;
  }
}
