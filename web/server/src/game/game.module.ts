import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { DatabaseModule } from 'src/database/database.module';
import { GameGateway } from './game.gateway';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RoomRepository } from 'src/database/repositories/room.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';
import { Rooms } from 'src/database/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Rooms]),
    DatabaseModule.forCustomRepository([UserRepository, RoomRepository]),
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
