import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { GameModule } from './game/game.module';
import { DatabaseModule } from './database/database.module';
import { UserRepository } from './database/repositories/user.repository';
import { DMModule } from './dm/dm.module';
import { AlertModule } from './alert/alert.module';

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
    DMModule,
    DatabaseModule.forCustomRepository([UserRepository]),
    AlertModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
