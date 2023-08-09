import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameDataDTO } from './dto/GameData.dto';
import { GameService } from './game.service';
import { GameReadyDTO } from './dto/GameReady.dto';
import { GameRoomManager } from './objects/game.RoomManager';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class GameGateway {
  @WebSocketServer() io: Server;
  gameService: GameService;
  gameManager: GameRoomManager;
  // queue

  @SubscribeMessage('game/match')
  handleGameMatch(client: Socket, data: GameReadyDTO) {
    this.gameManager.enqueue({ socket: client, nickname: data.nickname });
    if (this.gameManager.isMatched()) {
      // 두 클라이언트에게 보내줄 게임방 정보 데이터 구성
      // 디큐
      // 두 클라이언트에게 emit
    }
    /*
      매치에 참여한다 -> queue에 들어간다.
      1. 큐확인 있어? -> 큐에 있는 상대랑 조인 -> 두 명한데 emit (join한 room 번호)
      2. 없어? -> 큐에 집어 넣는다.
    */
    // console.log('game', data);

    client.broadcast.emit('game', data);
    setInterval(this.gameMain, 0.1);
  }

  @SubscribeMessage('game/join')
  handleGameJoin(client: Socket, data: GameDataDTO) {
    const key = this.gameManager.newGameRoomKey();
    client.join(key);
    client.broadcast.to(key).emit('game/join', data);
  }

  @SubscribeMessage('game/bar')
  handleGameBarMove(client: Socket, data: GameDataDTO) {
    this.gameService.barPosition();
  }

  private async gameMain() {
    this.gameService.play();
    // 계산, 현재위치 + 공 스피드 => emit
    // room.emit('data') 공위치
  }
}
