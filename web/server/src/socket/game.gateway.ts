import {
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JoinGameRoomData } from './dto/JoinGameRoomData.dto';

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:5173'],
	},
})
export class GameGateway {
    @SubscribeMessage('game/join')
    handleJoinRoom(client: Socket, data: JoinGameRoomData) {
        client.join(data.roomId);
        client.broadcast.to(data.roomId).emit('join', data.userId);
    }
}
