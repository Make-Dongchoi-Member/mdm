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
import { AppGateway } from './app.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { GameModule } from './game/game.module';

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
    TypeOrmModule.forRoot(typeORMConfig),
    LoginModule,
    UserModule,
    ChatModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
