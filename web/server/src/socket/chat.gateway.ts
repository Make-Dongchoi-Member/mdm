import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JoinChatRoomData } from '../dto/JoinChatRoomData.dto';
import { Message } from 'src/dto/Message.dto';
import { SetRequestData } from 'src/dto/SetRequestData.dto';

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:5173'],
	},
})
export class ChatGateway {
    @WebSocketServer() io: Server;
    
    @SubscribeMessage('chat/join')
    handleJoinRoom(client: Socket, data: JoinChatRoomData) {
        console.log("chat/join", data);
        /*
            @TODO
            유저의 소켓 아이디와 유저 아이디의 쌍이 맞는지 확인
            방 참가 권한 체크
        */

        client.join(data.roomId);
        client.broadcast.to(data.roomId).emit('chat/join', data);
    }

    @SubscribeMessage('chat/message')
    handleMessage(client: Socket, data: Message) {
        console.log("chat/message", data);

        /*
            @TODO
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            룸 아이디가 맞는지 확인
            방 참가 권한 체크
        */
        client.to(data.roomId).emit('chat/message', data);
    }

    @SubscribeMessage('chat/set-admin')
    handleSetAdmin(client: Socket, data: SetRequestData) {
        console.log("chat/set-admin", data);
        /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인
        */
        this.io.to(data.roomId).emit("chat/set-admin", data);
    }

    @SubscribeMessage('chat/set-mute')
    handleSetMute(client: Socket, data: SetRequestData) {
        console.log("chat/set-mute", data);
        /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인
        */
        this.io.to(data.roomId).emit("chat/set-mute", data);
    }

    @SubscribeMessage('chat/set-kick')
    handleSetKick(client: Socket, data: SetRequestData) {
        console.log("chat/set-kick", data);
        /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인
        */
        this.io.to(data.roomId).emit("chat/set-kick", data);
    }

    @SubscribeMessage('chat/unset-admin')
    handleUnsetAdmin(client: Socket, data: SetRequestData) {
        console.log("chat/unset-admin", data);
        /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인
        */
        this.io.to(data.roomId).emit("chat/unset-admin", data);
    }

    @SubscribeMessage('chat/unset-mute')
    handleUnsetMute(client: Socket, data: SetRequestData) {
        console.log("chat/unset-mute", data);
        /*
            @TODO
            유저의 방 참가 권한 체크
            유저의 소켓 아이디와 메시지 보낸 유저 아이디의 쌍이 맞는지 확인
            타겟이 방에 존재하는지 확인
            보낸 유저가 방에 존재하는지 확인
            타겟이 적절한 권한을 가졌는지 확인
            보낸 유저의 권한이 적절한지 확인
        */
        this.io.to(data.roomId).emit("chat/unset-mute", data);
    }
}
