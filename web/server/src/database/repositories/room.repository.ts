import { In, Not, Repository } from 'typeorm';
import { Rooms } from '../entities/room.entity';
import { CustomRepository } from 'src/decorators/customrepository.decorator';
import { RoomType } from 'src/types/enums';
import { RoomInfo } from 'src/types/interfaces';
import { SALT_ROUNDS } from 'src/configs/constants';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@CustomRepository(Rooms)
export class RoomRepository extends Repository<Rooms> {
  async publicRooms() {
    return this.findBy({ roomtype: Not(RoomType.PRIVATE) });
  }

  async userEnteredRooms(userId: number) {
    return this.find({
      where: [
        { host: userId },
        { admin: In([userId]) },
        { members: In[userId] },
      ],
    });
  }

  async getRoomById(id: number) {
    return this.findOneBy({ id });
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
}
