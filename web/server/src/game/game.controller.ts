import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('api/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('start')
  async start() {
    // userstats gaming으로 변경
    // 
  }

}
