import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { DMService } from './dm.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { DMHistoryDTO } from 'src/dm/dto/DMHistory.dto';

@Controller('api/dm')
export class DMController {
  constructor(private readonly dmService: DMService) {}

  /**
   * DM 채팅 목록 API 요청
   * Get("/api/DM/dm?other=[otherID]")
   * >> otherID: string
   * << dm : DirectMessaageDTO
   */
  @Get('history')
  async directMessage(
    @UserId(ParseIntPipe) userId: number,
    @Query('other', ParseIntPipe) otherId: number,
  ): Promise<DMHistoryDTO> {
    return await this.dmService.getDirectMessages(userId, otherId);
  }
}
