import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { AlertEntity as AlertEntity } from 'src/database/entities/alert.entity';
import { DMRooms } from 'src/database/entities/dm-room.entity';
import { AlertRepository } from 'src/database/repositories/alert.repository';
import { RoomRepository } from 'src/database/repositories/room.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { GameStore } from 'src/game/game.store';
import { AlertData } from 'src/types/interfaces';

@Injectable()
export class AlertService {
  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly userRepository: UserRepository,
    private readonly roomRepository: RoomRepository,
    private readonly gameStore: GameStore,
  ) {}

  async alertList(userId: number) {
    const user = await this.userRepository.getUserByIdWithAlert(userId);
    if (!user) throw new NotFoundException(`user_id ${userId} Not Found`);
    return user.receiveAlerts.map(this.alertEntityToAlertData);
  }

  async followAlertSave(alert: AlertData) {
    const sender = await this.userRepository.getUserById(alert.sender.id);
    const receiver = await this.userRepository.getUserById(alert.receiver.id);
    if (
      sender.blocks.includes(receiver.id) ||
      receiver.blocks.includes(sender.id)
    ) {
      throw new Error();
    }
    await this.alertRepository.saveAlert(alert.alertType, sender, receiver);
  }

  async chatAlertSave(alert: AlertData) {
    const sender = await this.userRepository.getUserById(alert.sender.id);
    const receiver = await this.userRepository.getUserById(alert.receiver.id);
    const room = await this.roomRepository.getRoomById(+alert.roomId);
    if (
      sender.blocks.includes(receiver.id) ||
      receiver.blocks.includes(sender.id) ||
      receiver.rooms.includes(+alert.roomId) ||
      room.ban.includes(receiver.id)
    ) {
      throw new Error();
    }
    await this.alertRepository.saveAlert(
      alert.alertType,
      sender,
      receiver,
      +alert.roomId,
    );
  }

  async gameAlertSave(alert: AlertData) {
    const sender = await this.userRepository.getUserById(alert.sender.id);
    const receiver = await this.userRepository.getUserById(alert.receiver.id);
    if (
      sender.blocks.includes(receiver.id) ||
      receiver.blocks.includes(sender.id)
    ) {
      throw new Error();
    }
    await this.alertRepository.saveAlert(
      alert.alertType,
      sender,
      receiver,
      +alert.roomId,
    );
  }

  async alertDelete(alertId: number) {
    await this.alertRepository.delete(alertId);
  }

  private alertEntityToAlertData(entity: AlertEntity): AlertData {
    const alertData: AlertData = {
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
    if (entity.roomId) {
      alertData.roomId = entity.roomId.toString();
    }
    return alertData;
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

  async acceptChatAlert(userId: number, roomId: number) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundException(`user_id ${userId} Not Found`);
    const room = await this.roomRepository.getRoomById(roomId);
    if (!room) throw new NotFoundException(`room_id ${roomId} Not Found`);

    if (room.ban.includes(userId)) throw new NotAcceptableException('ban user');
    if (user.rooms.includes(roomId)) return;
    user.rooms.push(roomId);
    room.members.push(userId);
    room.memberCount = room.memberCount + 1;
    this.roomRepository.save(room);
    this.userRepository.save(user);
  }

  async setAlertState(userId: number, state: boolean) {
    await this.userRepository.setIsAlert(userId, state);
  }

  getNewGameRoomKey(): string {
    return this.gameStore.newGameRoomKey();
  }
}
