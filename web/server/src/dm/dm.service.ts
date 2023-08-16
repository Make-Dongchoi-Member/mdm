import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/database/repositories/user.repository';
import { Message, UserData } from 'src/types/interfaces';

@Injectable()
export class DMService {
  constructor(private readonly userRepository: UserRepository) {}

  async getDirectMessages(userId: number, otherId: number) {
    const other = await this.userRepository.getUserById(otherId);
    if (!other) throw new NotFoundException(`user_id ${otherId} Not Found`);
    const dmRoom = await this.userRepository.getDMRoom(userId, otherId);
    const me = dmRoom.users.find((e) => e.id === userId);
    const history: Message[] = [];
    if (dmRoom && dmRoom.messages) {
      for (const msg of dmRoom.messages) {
        const sender: UserData =
          msg.sender === me.id
            ? { id: me.id, avatar: me.avatar, nickname: me.nickName }
            : { id: other.id, avatar: other.avatar, nickname: other.nickName };
        const receiver = msg.receiver === me.id ? me.nickName : other.nickName;
        history.push({
          sender,
          receiver,
          body: msg.body,
          isDM: true,
          date: msg.date,
        });
      }
    }
    return {
      id: dmRoom.id,
      with: { id: other.id, avatar: other.avatar, nickname: other.nickName },
      history,
    };
  }

  async sendMessage(message: Message): Promise<string | null> {
    const receiver = await this.userRepository.getUserById(+message.receiver);
    const sender = await this.userRepository.getUserById(message.sender.id);
    await this.userRepository.pushDM(sender, message);
    return receiver.socket;
  }
}
