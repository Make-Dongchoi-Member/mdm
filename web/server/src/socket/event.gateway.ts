import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:5173'],
	},
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`connected:		${client.id}`);
    }

    handleDisconnect(client: Socket) {
		console.log(`disconnected:	${client.id}`);
    }
}
