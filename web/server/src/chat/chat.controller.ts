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
import { DMHistoryDTO } from '../dm/dto/DMHistory.dto';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * room 목록 요청
   * GET("/api/chat/list")
   * >>
   * << rooms: Room[]
   */
  @Get('list')
  async list(@UserId() userId: string): Promise<GetListDTO> {
    const rooms = await this.chatService.getRoomListOfUser(+userId);
    return { rooms };
  }

  /**
   * 들어간 방의 정보 API 요청
   * Get("/api/chat/room?room_id=[roomID]")
   * >> roomID: string
   * << openedRoom: RoomDetail
   */
  @Get('room')
  async room(@Query('room_id') roomId: string): Promise<GetRoomDTO> {
    const openedRoom = await this.chatService.getRoomDetail(+roomId);
    return { openedRoom };
  }

  /**
   * room 생성 API 요청
   * POST("/api/chat/create")
   * >> roomInfoDTO: RoomInfoDTO
   * << roomID: string
   */
  @Post('create')
  async create(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: RoomInfoDTO,
  ): Promise<PostCreateDTO> {
    const roomId = await this.chatService.createRoom(userId, data.roomInfo);
    return { roomId };
  }

  /**
   * 방 정보 수정 API 요청
   * POST(/api/chat/room/update)
   * >> roomInfoDTO: RoomInfoDTO
   * <<
   */
  @Post('room/update')
  async roomUpdate(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: RoomInfoDTO,
  ) {
    await this.chatService.updateRoom(userId, data.roomInfo);
  }

  /**
   * 방 나가기 API 요청
   * POST(/api/chat/room/out)
   * >> roomID: string
   * <<
   */
  @Post('room/out')
  async roomOut(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: RoomOutDTO,
  ) {
    await this.chatService.roomOut(userId, +data.roomId);
  }

  /**
   * 방 들어가기 API 요청
   * POST(/api/chat/room/enter)
   * >> roomId: string, password: string
   * <<
   */
  @Post('room/enter')
  async roomEnter(
    @UserId(ParseIntPipe) userId: number,
    @Body('data') data: RoomEnterDTO,
  ) {
    await this.chatService.roomEnter(userId, +data.roomId, data.password);
  }
}
