import { Controller, Get, Query, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';

// * room List 목록 요청
// GET("/api/chat/list?user_id=[userID]")
// >> userID: string
// << rooms: Room[]

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
  async list(@Req() req: Request) {
    const userId = req['user_id'];
    return await this.chatService.getRoomListByUserID(+userId);
  }
}
