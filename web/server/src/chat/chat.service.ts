import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ROOM_REPOSITORY, USER_REPOSITORY } from 'src/configs/constants';
import { Rooms } from 'src/database/entities/room.entity';
import { Users } from 'src/database/entities/user.entity';
import { Level, RoomType } from 'src/types/enums';
import { Profile } from 'src/types/interfaces';
import { In, Repository } from 'typeorm';
import { roomDetail } from './dto/chat.room-detail.dto';
import { RoomInfoDto } from './dto/chat.room-info.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  constructor(
    @Inject(ROOM_REPOSITORY) private roomRepository: Repository<Rooms>,
    @Inject(USER_REPOSITORY) private userRepository: Repository<Users>,
    private config: ConfigService,
  ) {}

  async getRoomListByUserID(userId: number) {
    const userInfo = await this.userRepository.findOneByOrFail({ id: userId });
    const rooms = await this.roomRepository.find({
      where: {
        id: In([userInfo.rooms]),
      },
    });
    return rooms;
  }

  async getRoomDetail(roomId: number) {
    const room = await this.roomRepository.findOneByOrFail({ id: roomId });
    const users = await this.userRepository.find({
      where: {
        id: In([...room.members, room.host, room.admin]),
      },
    });
    const members = this.roomMembers(room, users);
    const roomDetail: roomDetail = {
      id: room.id.toString(),
      name: room.name,
      roomtype: room.roomtype,
      memberCount: room.memberCount,
      members,
      history: room.messages,
    };
    return roomDetail;
  }

  async createRoom(roomInfo: RoomInfoDto) {
    const newRoomEntity = this.roomRepository.create({
      name: roomInfo.roomname,
      password: await this.genRoomPassword(roomInfo),
      roomtype: roomInfo.roomtype,
      host: +roomInfo.hostId,
    });
    return (await this.roomRepository.save(newRoomEntity)).id.toString();
  }

  private async genRoomPassword(info: {
    password: string;
    roomtype: RoomType;
  }): Promise<string> | null {
    if (info.roomtype !== RoomType.lock) {
      return null;
    }
    return this.createHash(info.password);
  }

  private async createHash(pw: string) {
    const salt = await bcrypt.genSalt(this.config.get<number>('SALT_ROUNDS'));
    return bcrypt.hash(pw, salt);
  }

  async updateRoom(roomInfo: RoomInfoDto) {
    let room = await this.roomRepository.findOneByOrFail({
      id: +roomInfo.roomId,
    });
    if (room.host.toString() !== roomInfo.hostId) {
      throw new ForbiddenException();
    }
    room = await this.updateRoomEntity(room, roomInfo);
    await this.roomRepository.save(room);
  }

  private async updateRoomEntity(room: Rooms, updateValue: RoomInfoDto) {
    room.name = updateValue.roomname;
    room.password = await this.genRoomPassword(updateValue);
    room.roomtype = updateValue.roomtype;
    return room;
  }

  private roomMembers(room: Rooms, users: Users[]) {
    const members: Map<string, Profile> = new Map();
    for (const user of users) {
      const profile: Profile = {
        user: {
          id: user.id,
          avatar: user.avatar,
        },
        level: this.userLevel(room, user),
        isMuted: room.mute.includes(user.id),
      };
      members.set(user.id.toString(), profile);
    }
    return members;
  }

  private userLevel(room: Rooms, user: Users) {
    let level: Level;
    switch (user.id) {
      case room.host:
        level = Level.host;
        break;
      case room.admin.includes(user.id) ? user.id : -1:
        level = Level.admin;
      default:
        level = Level.member;
        break;
    }
    return level;
  }
}
