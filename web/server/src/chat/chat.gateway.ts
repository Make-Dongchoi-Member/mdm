import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JoinChatRoomDTO } from './dto/JoinChatRoom.dto';
import { SetRequestDTO } from './dto/SetRequest.dto';
import { MessageDTO } from './dto/Message.dto';
import { EnterChatRoomDTO } from './dto/EnterChatRoom.dto';
import { ChatService } from './chat.service';
import { OutChatRoomDTO } from './dto/OutChatRoom.dto';
import { LeaveChatRoomDTO } from './dto/LeaveChatRoom.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() io: Server;

  @SubscribeMessage('chat/join')
  handleJoinRoom(client: Socket, data: JoinChatRoomDTO) {
    client.join(data.roomId);
  }

  @SubscribeMessage('chat/enter')
  async handleEnterRoom(client: Socket, data: EnterChatRoomDTO) {
    console.log('chat/enter', data);

    /*
      @TODO
      유저의 소켓 아이디와 유저 아이디의 쌍이 맞는지 확인
      방 참가 권한 체크
    */

    const enterUser = await this.chatService.getEnterUser(Number(data.userId));

    client.join(data.roomId);
    client.broadcast.to(data.roomId).emit('chat/enter', enterUser);
  }

  @SubscribeMessage('chat/message')
  handleMessage(client: Socket, data: MessageDTO) {
    console.log('chat/message', data);

    /*
        @TODO
        유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
        룸 아이디가 맞는지 확인
        방 참가 권한 체크
    */

    client.broadcast.to(data.message.roomId).emit('chat/message', data);
  }

  @SubscribeMessage('chat/set-admin')
  handleSetAdmin(client: Socket, data: SetRequestDTO) {
    console.log('chat/set-admin', data);
    /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인
        */
    this.io.to(data.roomId).emit('chat/set-admin', data);
  }

  @SubscribeMessage('chat/set-mute')
  handleSetMute(client: Socket, data: SetRequestDTO) {
    console.log('chat/set-mute', data);
    /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인
        */
    this.io.to(data.roomId).emit('chat/set-mute', data);
  }

  @SubscribeMessage('chat/unset-admin')
  handleUnsetAdmin(client: Socket, data: SetRequestDTO) {
    console.log('chat/unset-admin', data);
    /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인
        */
    this.io.to(data.roomId).emit('chat/unset-admin', data);
  }

  @SubscribeMessage('chat/unset-mute')
  handleUnsetMute(client: Socket, data: SetRequestDTO) {
    console.log('chat/unset-mute', data);
    /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인
        */
    this.io.to(data.roomId).emit('chat/unset-mute', data);
  }

  @SubscribeMessage('chat/set-kick')
  handleSetKick(client: Socket, data: SetRequestDTO) {
    console.log('chat/set-kick', data);
    /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인

            강퇴당한 유저를 방에서 나가도록 하기
            유저의 id로 소켓 id를 가져와서 그 소켓 id로 메시지를 보내야함.
        */
    client.to(data.roomId).emit('chat/set-kick', data);
  }

  @SubscribeMessage('chat/out')
  handleOutRoom(client: Socket, data: OutChatRoomDTO) {
    console.log('chat/out', data);
    /*
            @TODO
            유저의 소켓 아이디와 유저 아이디의 쌍이 맞는지 확인
            방에 있는 유저인지 체크
        */

    client.broadcast.to(data.roomId).emit('chat/out', data);
  }

  @SubscribeMessage('chat/leave')
  handleLeaveRoom(client: Socket, data: LeaveChatRoomDTO) {
    console.log('chat/leave', data);
    /*
            @TODO
            유저의 소켓 아이디와 유저 아이디의 쌍이 맞는지 확인
            방에 있는 유저인지 체크
        */

    client.leave(data.roomId);
  }
}
