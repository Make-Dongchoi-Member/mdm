import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameDataDTO } from './dto/GameData.dto';

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:5173'],
	},
})
export class GameGateway {
    @WebSocketServer() io: Server;
    // queue

    @SubscribeMessage('game/match')
    handleGameMatch(client: Socket, data: GameDataDTO) {
        /*
            매치에 참여한다 -> queue에 들어간다.
            1. 큐확인 있어? -> 큐에 있는 상대랑 조인 -> 두 명한데 emit (join한 room 번호)
            2. 없어? -> 큐에 집어 넣는다.
        */
        console.log("game", data);

        client.broadcast.emit('game', data);
        setInterval(this.gameMain, 0.1);
    }

    @SubscribeMessage('game/join')
    handleGameJoin(client: Socket, data: GameDataDTO) {
        
    }

    private async gameMain() {
        // 계산, 현재위치 + 공 스피드 => emit
        // room.emit('data') 공위치
    }
}
