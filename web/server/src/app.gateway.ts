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

  handleDisconnect(client: Socket) {
    this.userRepository.unsetSocketId(client.id);
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
        this.userRepository.setSocketId(+payload.sub, client.id);
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
