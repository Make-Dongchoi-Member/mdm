import {
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JoinChatRoomData } from '../dto/JoinChatRoomData.dto';
import { Message } from 'src/dto/Message.dto';

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:5173'],
	},
})
export class ChatGateway {
    @SubscribeMessage('chat/join')
    handleJoinRoom(client: Socket, data: JoinChatRoomData) {
        console.log(data);
        
        client.join(data.roomId);
        client.broadcast.to(data.roomId).emit('chat/join', data);
    }

    @SubscribeMessage('chat/message')
    handleMessage(client: Socket, data: Message) {
        client.broadcast.to(data.roomId).emit('chat/message', data);
    }
}
