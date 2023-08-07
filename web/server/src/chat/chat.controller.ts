import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
    /**
     * @TODO
     *  RoomInfo의 리스트를 보내주세요!!!
     *  내가 들어간 방 + 프라이빗 제외한 모든 방 목록을 보내주세요!!!!!
     */
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
  async create(@Body('data') data: RoomInfoDTO): Promise<PostCreateDTO> {
    // 요청 userID와 roomInfo의 hostID 비교 로직 필요
    const roomId = await this.chatService.createRoom(data.roomInfo);
    return { roomId };
  }

  /**
   * 방 정보 수정 API 요청
   * POST(/api/chat/room/update)
   * >> roomInfoDTO: RoomInfoDTO
   * <<
   */
  @Post('room/update')
  async roomUpdate(@Body('data') data: RoomInfoDTO) {
    // 요청 userID와 roomInfo의 hostID 비교 로직 필요
    await this.chatService.updateRoom(data.roomInfo);
  }

  /**
   * 방 나가기 API 요청
   * POST(/api/chat/room/out)
   * >> roomID: string
   * <<
   */
  @Post('room/out')
  async roomOut(@UserId() userId: string, @Body('data') data: RoomOutDTO) {
    await this.chatService.roomOut(+userId, +data.roomId);
  }

  /**
   * 방 들어가기 API 요청
   * POST(/api/chat/room/enter)
   * >> roomId: string, password: string
   * <<
   */
  @Post('room/enter')
  async roomEnter(@UserId() userId: string, @Body('data') data: RoomEnterDTO) {
    await this.chatService.roomEnter(+userId, +data.roomId, data.password);
  }
}
