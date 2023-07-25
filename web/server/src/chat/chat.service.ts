import { Inject, Injectable } from '@nestjs/common';
import { ROOM_REPOSITORY, USER_REPOSITORY } from 'src/configs/constants';
import { Rooms } from 'src/database/entities/room.entity';
import { Users } from 'src/database/entities/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @Inject(ROOM_REPOSITORY) private roomRepository: Repository<Rooms>,
    @Inject(USER_REPOSITORY) private userRepository: Repository<Users>,
  ) {}

  async getRoomListByUserID(userId: number) {
    const userInfo = await this.userRepository.findOneBy({ id: userId });
    const rooms = await this.roomRepository.find({
      where: {
        id: In([userInfo.rooms]),
      },
    });
    return rooms;
  }
}
