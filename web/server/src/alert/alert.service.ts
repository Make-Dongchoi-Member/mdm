import { Injectable, NotFoundException } from '@nestjs/common';
import { AlarmEntity as AlertEntity } from 'src/database/entities/alarm.entity';
import { DMRooms } from 'src/database/entities/dm-room.entity';
import { AlertRepository } from 'src/database/repositories/alarm.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AlertData } from 'src/types/interfaces';

@Injectable()
export class AlertService {
  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async alertList(userId: number) {
    const user = await this.userRepository.getUserByIdWithAlarm(userId);
    if (!user) throw new NotFoundException(`user_id ${userId} Not Found`);
    return user.receiveAlarms.map(this.alertEntityToAlertData);
  }

  async alertSave(alert: AlertData) {
    const sender = await this.userRepository.getUserById(alert.sender.id);
    const receiver = await this.userRepository.getUserById(alert.receiver.id);
    await this.alertRepository.saveAlert(alert.alertType, sender, receiver);
  }

  async alertDelete(alertId: number) {
    await this.alertRepository.delete(alertId);
  }

  private alertEntityToAlertData(entity: AlertEntity): AlertData {
    return {
      alertId: entity.id,
      alertType: entity.type,
      sender: {
        id: entity.sender.id,
        avatar: entity.sender.avatar,
        nickname: entity.sender.nickName,
      },
      receiver: {
        id: entity.receiver.id,
        avatar: entity.receiver.avatar,
        nickname: entity.receiver.nickName,
      },
      date: entity.date,
    };
  }

  async getSocketId(userId: number): Promise<string> | null {
    const user = await this.userRepository.getUserById(userId);
    return user.socket;
  }

  async acceptFollowAlert(myId: number, friendId: number) {
    const friend = await this.userRepository.getUserById(friendId);
    const me = await this.userRepository.getUserById(myId);

    if (friend.friends.includes(me.id)) return;

    friend.friends.push(me.id);
    me.friends.push(friend.id);
    this.userRepository.save([friend, me]);
    const dmRooms = new DMRooms();
    dmRooms.users = [friend, me];
    dmRooms.messages = [];
    this.userRepository.manager.save(dmRooms);
  }

  async acceptChatAlert(myId: number, friendId: number) {
    const friend = await this.userRepository.getUserById(friendId);
    const me = await this.userRepository.getUserById(myId);

    if (friend.friends.includes(me.id)) return;

    friend.friends.push(me.id);
    me.friends.push(friend.id);
    this.userRepository.save([friend, me]);
    const dmRooms = new DMRooms();
    dmRooms.users = [friend, me];
    dmRooms.messages = [];
    this.userRepository.manager.save(dmRooms);
  }

  async setAlertState(userId: number, state: boolean) {
    await this.userRepository.setIsAlert(userId, state);
  }
}
