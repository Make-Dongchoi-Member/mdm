import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { RoomInfoDto } from './dto/chat.room-info.dto';

/**
 * * 방 들어가기 API 요청
    POST
    >> roomId: string, userId: string, password: string
    << result: boolean
    export interface RoomEnterDTO {
        roomId: string;
        userId: string;
        password: string;
    }
    일반 방은 비밀번호가 빈상태로 가고, 비밀번호 방은 채워서 갑니다.
 */

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * room 목록 요청
   * GET("/api/chat/list")
   * >>
   * << rooms: Room[]
   */
  @Get('list')
  async list(@UserId() userId: string) {
    const rooms = await this.chatService.getRoomListByUserID(+userId);
    return { rooms };
  }

  /**
   * 들어간 방의 정보 API 요청
   * Get("/api/room?room_id=[roomID]")
   * >> roomID: string
   * << openedRoom: RoomDetail
   */
  @Get('room')
  async room(@Query('room_id') roomId: string) {
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
  async create(@Body('roomInfo') roomInfo: RoomInfoDto) {
    // 요청 userID와 roomInfo의 hostID 비교 로직 필요
    const roomID = await this.chatService.createRoom(roomInfo);
    return { roomID };
  }

  /**
   * 방 정보 수정 API 요청
   * POST(/api/chat/room/update)
   * >> roomInfoDTO: RoomInfoDTO
   * <<
   */
  @Post('room/update')
  async roomUpdate(@Body('roomInfo') roomInfo: RoomInfoDto) {
    // 요청 userID와 roomInfo의 hostID 비교 로직 필요
    await this.chatService.updateRoom(roomInfo);
  }

  /**
   * 방 나가기 API 요청
   * POST(/api/chat/room/out)
   * >> roomID: string
   * <<
   */
  @Post('room/out')
  async roomOut(@UserId() userId: string, @Body('roomId') roomId: string) {
    await this.chatService.roomOut(+userId, +roomId);
  }
}
