import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { DirectMessageDTO } from './dto/DirectMessage.dto';
import { DMService } from './dm.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class DMGateway {
  constructor(private readonly dmService: DMService) {}

  @WebSocketServer() io: Server;

  @SubscribeMessage('dm/message')
  async handleMessage(client: Socket, data: DirectMessageDTO) {
    const socketId = await this.dmService.sendMessage(data.message);
    if (socketId) {
      client.to(socketId).emit('dm/message', data);
    }
  }
}
