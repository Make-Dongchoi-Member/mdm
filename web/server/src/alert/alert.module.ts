import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';
import { AlarmEntity } from 'src/database/entities/alarm.entity';
import { DatabaseModule } from 'src/database/database.module';
import { AlertRepository } from 'src/database/repositories/alarm.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AlertGateway } from './alert.gateway';
import { ChatService } from 'src/chat/chat.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, AlarmEntity]),
    DatabaseModule.forCustomRepository([AlertRepository, UserRepository]),
    ChatModule,
  ],
  providers: [AlertService, AlertGateway],
  controllers: [AlertController],
})
export class AlertModule {}
