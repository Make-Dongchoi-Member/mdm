import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { DatabaseModule } from 'src/database/database.module';
import { ChatGateway } from './chat.gateway';
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
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
