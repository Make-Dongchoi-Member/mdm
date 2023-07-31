import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { DatabaseModule } from 'src/database/database.module';
import { userProvider } from 'src/database/providers/user.provider';
import { roomProvider } from 'src/database/providers/room.provider';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [ChatController],
  providers: [userProvider, roomProvider, ChatService, ChatGateway],
})
export class ChatModule {}
