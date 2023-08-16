import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AlertService } from './alert.service';
import { AlertData } from 'src/types/interfaces';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class AlertGateway {
  constructor(private readonly alertService: AlertService) {}

  @WebSocketServer() io: Server;

  @SubscribeMessage('alert/follow')
  async handleJoinRoom(client: Socket, data: AlertData) {
    this.alertService.alertSave(data);
    const receiverSocketId = await this.alertService.getSocketId(
      data.receiver.id,
    );
    client.to(receiverSocketId).emit('alert');
  }
}
