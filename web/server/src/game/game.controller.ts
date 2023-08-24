import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { InfoValidPipe } from 'src/user/pipes/info.valid.pipe';
import { GameRoomDTO } from './dto/GameRoom.dto';

@Controller('api/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('key')
  async getKey(@Query('nickname', InfoValidPipe) nickname: string) {
    const gameRoom: GameRoomDTO | null =
      this.gameService.getPrivateRoomKey(nickname);
    return { gameRoom };
  }
}
