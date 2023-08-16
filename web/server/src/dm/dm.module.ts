import { Module } from '@nestjs/common';
import { DMController } from './dm.controller';
import { DMService } from './dm.service';
import { DatabaseModule } from 'src/database/database.module';
import { DMGateway } from './dm.gateway';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RoomRepository } from 'src/database/repositories/room.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';
import { Rooms } from 'src/database/entities/room.entity';
import { MessageEntity } from 'src/database/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Rooms, MessageEntity]),
    DatabaseModule.forCustomRepository([UserRepository, RoomRepository]),
  ],
  controllers: [DMController],
  providers: [DMService, DMGateway],
})
export class DMModule {}
