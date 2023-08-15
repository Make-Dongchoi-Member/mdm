import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JWT_SECRET } from './configs/constants';
import { UserRepository } from './database/repositories/user.repository';
import { UserService } from './user/user.service';
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

  async handleConnection(client: Socket, ...args: any[]) {
    const token = this.extractAccessToken(client.handshake.headers.cookie);
    this.verify(token, client);
  }

  async handleDisconnect(client: Socket) {
    console.log(client.id);

    try {
      await this.userRepository.setStatusBySocketId(
        client.id,
        UserState.OFFLINE,
      );
      await this.userRepository.unsetSocketId(client.id);
    } catch (e) {
      console.log(e);
    }
  }

  private async verify(token: string, client: Socket) {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get(JWT_SECRET),
      });
      if (this.userRepository.findOneBy({ id: +payload.sub }) === null) {
        client.disconnect();
      } else {
        await this.userRepository.setSocketId(+payload.sub, client.id);
        await this.userRepository.setStatusBySocketId(
          client.id,
          UserState.ONLINE,
        );
      }
    } catch (e) {
      console.log('There is error!');
      client.disconnect();
    }
  }

  private extractAccessToken(cookies: string): string | null {
    const matches = cookies.match(/access_token=([^;]+)/);
    return matches ? matches[1] : null;
  }
}
