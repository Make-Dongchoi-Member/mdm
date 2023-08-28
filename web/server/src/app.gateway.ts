import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JWT_SECRET } from './configs/constants';
import { UserRepository } from './database/repositories/user.repository';
import { UserState } from './types/enums';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private userRepository: UserRepository,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    const token = this.extractAccessToken(client.handshake.headers.cookie);
    this.verify(token, client);
  }

  async handleDisconnect(client: Socket) {
    try {
      const user = await this.userRepository.getUserBySocketId(client.id);
      if (!user) return;

      for (const iterator of user.friends) {
        const friend = await this.userRepository.findOneBy({ id: iterator });
        if (friend.socket) {
          client.to(friend.socket).emit('offline', { who: user.id });
        }
      }

      await this.userRepository.setStatusBySocketId(
        client.id,
        UserState.OFFLINE,
      );
      await this.userRepository.unsetSocketId(client.id);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('app/logout')
  async handleLogout(client: Socket) {
    client.disconnect();
  }

  private async verify(token: string, client: Socket) {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get(JWT_SECRET),
      });
      const user = await this.userRepository.findOneBy({ id: +payload.sub });
      if (user === null) {
        client.disconnect();
      } else {
        if (user.socket) {
          const socket = this.server.sockets.sockets.get(user.socket);
          this.server.to(user.socket).emit('app/disconnect-another-user');
          if (socket) {
            socket.disconnect();
          }
        }
        await this.userRepository.setSocketId(+payload.sub, client.id);
        await this.userRepository.setStatusBySocketId(
          client.id,
          UserState.ONLINE,
        );
        for (const iterator of user.friends) {
          const friend = await this.userRepository.findOneBy({ id: iterator });
          if (friend.socket) {
            client.to(friend.socket).emit('online', { who: user.id });
          }
        }
      }
    } catch (e) {
      console.error('There is error!');
      client.disconnect();
    }
  }

  private extractAccessToken(cookies: string): string | null {
    const matches = cookies.match(/access_token=([^;]+)/);
    return matches ? matches[1] : null;
  }
}
