import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AlertService } from './alert.service';
import { AlertData } from 'src/types/interfaces';
import { GameStore } from 'src/game/game.store';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class AlertGateway {
  constructor(
    private readonly alertService: AlertService,
    private readonly gameStore: GameStore,
  ) {}

  @WebSocketServer() io: Server;

  @SubscribeMessage('alert/follow')
  async handleAlertFollow(client: Socket, data: AlertData) {
    try {
      await this.alertService.followAlertSave(data);
      const receiverSocketId = await this.alertService.getSocketId(
        data.receiver.id,
      );
      this.alertService.setAlertState(data.receiver.id, true);
      client.to(receiverSocketId).emit('alert');
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('alert/chat')
  async handleAlertChat(client: Socket, data: AlertData) {
    try {
      await this.alertService.chatAlertSave(data);
      const receiverSocketId = await this.alertService.getSocketId(
        data.receiver.id,
      );
      this.alertService.setAlertState(data.receiver.id, true);
      client.to(receiverSocketId).emit('alert');
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('alert/game')
  async handleAlertGame(client: Socket, data: AlertData) {
    try {
      data.roomId = this.alertService.getNewGameRoomKey();
      this.gameStore.pushPrivateGame(client, data);
      client.join(data.roomId);
      await this.alertService.gameAlertSave(data);
      const receiverSocketId = await this.alertService.getSocketId(
        data.receiver.id,
      );
      this.alertService.setAlertState(data.receiver.id, true);
      client.to(receiverSocketId).emit('alert');
    } catch (error) {
      console.error(error);
    }
  }
}
