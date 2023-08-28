import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { GetListDTO } from './dto/GetList.dto';
import { GetRoomDTO } from './dto/GetRoom.dto';
import { PostCreateDTO } from './dto/PostCreate.dto';
import { RoomInfoDTO } from './dto/RoomInfo.dto';
import { RoomOutDTO } from './dto/RoomOut.dto';
import { RoomEnterDTO } from './dto/RoomEnter.dto';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('list')
  async list(@UserId(ParseIntPipe) userId: number): Promise<GetListDTO> {
    const rooms = await this.chatService.getRoomListOfUser(userId);
    return { rooms };
  }

  @Get('room')
  async room(
    @UserId(ParseIntPipe) userId: number,
    @Query('room_id', ParseIntPipe) roomId: number,
  ): Promise<GetRoomDTO> {
    const openedRoom = await this.chatService.getRoomDetail(userId, roomId);
    return { openedRoom };
  }

  @Post('create')
  async create(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: RoomInfoDTO,
  ): Promise<PostCreateDTO> {
    const roomId = await this.chatService.createRoom(userId, data.roomInfo);
    return { roomId };
  }

  @Post('room/update')
  async roomUpdate(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: RoomInfoDTO,
  ) {
    await this.chatService.updateRoom(userId, data.roomInfo);
  }

  @Post('room/out')
  async roomOut(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: RoomOutDTO,
  ) {
    await this.chatService.roomOut(userId, +data.roomId);
  }

  @Post('room/enter')
  async roomEnter(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: RoomEnterDTO,
  ) {
    await this.chatService.roomEnter(userId, +data.roomId, data.password);
  }
}
