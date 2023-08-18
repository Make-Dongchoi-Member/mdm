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
import { RoomRepository } from 'src/database/repositories/room.repository';
import { Rooms } from 'src/database/entities/room.entity';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, AlarmEntity, Rooms]),
    DatabaseModule.forCustomRepository([
      AlertRepository,
      UserRepository,
      RoomRepository,
    ]),
    GameModule,
  ],
  providers: [AlertService, AlertGateway],
  controllers: [AlertController],
})
export class AlertModule {}
