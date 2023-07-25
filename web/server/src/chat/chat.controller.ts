import { Controller, Get, Headers, Query, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { UserId } from 'src/decorators/user-id.decorator';

// * Chatting방 생성 API 요청
// POST("/api/chat/create")
// >> roomInfoDTO: RoomInfoDTO
// << roomID: string

// * 들어간 방의 정보 API 요청
// POST("/api/chat/room")
// >> userID: string, roomID: string
// << openedRoom: RoomDetail

// * 방 정보 수정 API 요청
// POST(/api/chat/room/update)
// >> roomInfoDTO: RoomInfoDTO
// << result: boolean

// * 방 나가기 API 요청
// POST(/api/chat/room/out)
// >> userID: string, roomID: string
// << result: boolean

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
  async list(@UserId('user_id') userId: string) {
    return await this.chatService.getRoomListByUserID(+userId);
  }

  /**
   * 들어간 방의 정보 API 요청
   * Get("/api/room?room_id=[roomID]")
   * >> roomID: string
   * << openedRoom: RoomDetail
   */
  @Get('room')
  async room(
    @UserId('user_id') userId: string,
    @Query('room_id') roomId: string,
  ) {}
}
