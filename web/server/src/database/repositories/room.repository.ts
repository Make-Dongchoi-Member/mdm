import { ArrayContains, Not, Repository } from 'typeorm';
import { Rooms } from '../entities/room.entity';
import { CustomRepository } from 'src/decorators/customrepository.decorator';
import { RoomType } from 'src/types/enums';
import { Message, RoomInfo } from 'src/types/interfaces';
import { SALT_ROUNDS } from 'src/configs/constants';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MessageEntity } from '../entities/message.entity';
import { Users } from '../entities/user.entity';

@CustomRepository(Rooms)
export class RoomRepository extends Repository<Rooms> {
  async publicRooms() {
    return this.findBy({ roomtype: Not(RoomType.PRIVATE) });
  }

  async userEnteredRooms(userId: number) {
    return this.find({
      where: [
        { host: userId },
        { admin: ArrayContains([userId]) },
        { members: ArrayContains([userId]) },
      ],
    });
  }

  async getRoomById(id: number) {
    return this.findOne({ where: { id }, relations: { messages: true } });
  }

  async saveRoom(roomInfo: RoomInfo) {
    const roomEntity = this.create({
      name: roomInfo.roomname,
      password: await this.genRoomPassword(roomInfo),
      roomtype: roomInfo.roomtype,
      host: +roomInfo.hostId,
    });
    return await this.save(roomEntity);
  }

  async updateRoom(id: number, updateData: QueryDeepPartialEntity<Rooms>) {
    this.update(id, updateData);
  }

  async updateRoomInfo(roomInfo: RoomInfo) {
    this.update(roomInfo.roomId, {
      name: roomInfo.roomname,
      password: await this.genRoomPassword(roomInfo),
      roomtype: roomInfo.roomtype,
    });
  }

  async checkRoomPassword(plainTextPassword: string, hash: string) {
    return bcrypt.compare(plainTextPassword, hash);
  }

  private async genRoomPassword(info: {
    password: string;
    roomtype: RoomType;
  }): Promise<string> | null {
    if (info.roomtype !== RoomType.LOCK) {
      return null;
    }
    return this.createHash(info.password);
  }

  private async createHash(pw: string) {
    const salt = await bcrypt.genSalt(
      new ConfigService().get<number>(SALT_ROUNDS),
    );
    return bcrypt.hash(pw, salt);
  }

  async pushMessage(user: Users, message: Message) {
    const room = await this.findOneBy({ id: Number(message.roomId) });
    const messageEntity = new MessageEntity();
    messageEntity.roomId = message.roomId;
    messageEntity.body = message.body;
    messageEntity.isDM = message.isDM;
    messageEntity.date = new Date();
    messageEntity.sender = user;
    messageEntity.room = room;
    this.manager.save(messageEntity);
  }

  async getAdmin(roomId: number) {
    const room = await this.findOneBy({ id: roomId });
    return room.admin;
  }

  async pushAdmin(roomId: number, userId: number) {
    console.log('pushAdmin', roomId, userId);

    await this.update(roomId, {
      admin: () => `array_append("admin", ${userId})`,
    });
  }

  async removeAdmin(roomId: number, userId: number) {
    await this.update(roomId, {
      admin: () => `array_remove("admin", ${userId})`,
    });
  }

  async getMute(roomId: number) {
    const room = await this.findOneBy({ id: roomId });
    return room.mute;
  }

  async pushMute(roomId: number, userId: number) {
    await this.update(roomId, {
      mute: () => `array_append("mute", ${userId})`,
    });
  }

  async removeMute(roomId: number, userId: number) {
    await this.update(roomId, {
      mute: () => `array_remove("mute", ${userId})`,
    });
  }

  async pushBan(roomId: number, userId: number) {
    await this.update(roomId, {
      ban: () => `array_append("ban", ${userId})`,
    });
  }
}
