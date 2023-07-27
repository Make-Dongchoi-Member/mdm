import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './login/guards/login.jwt.guard';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './socket/chat.gateway';
import { GameGateway } from './socket/game.gateway';
import { EventsGateway } from './socket/event.gateway';

let staticModule = [];
if (process.env.NODE_ENV === 'prod') {
  staticModule = [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ];
}

@Module({
  imports: [
    ...staticModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoginModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    EventsGateway,
    ChatGateway,
    GameGateway
  ],
})
export class AppModule {}
