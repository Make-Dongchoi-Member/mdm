import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ROOM_REPOSITORY, USER_REPOSITORY } from 'src/configs/constants';
import { Rooms } from 'src/database/entities/room.entity';
import { Users } from 'src/database/entities/user.entity';
import { Level, RoomType } from 'src/types/enums';
import { Profile, RoomDetail, RoomInfo } from 'src/types/interfaces';
import { In, Repository } from 'typeorm';
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
    const userInfo = await this.userRepository
      .findOneByOrFail({ id: userId })
      .catch(() => {
        throw new NotFoundException(`user_id ${userId} Not Found`);
      });
    console.log(userInfo);
    const rooms = await this.roomRepository.find({
      where: {
        id: In(userInfo.rooms),
      },
    });
    return rooms;
  }

  async getRoomDetail(roomId: number) {
    const room = await this.roomRepository
      .findOneByOrFail({ id: roomId })
      .catch(() => {
        throw new NotFoundException(`room_id ${roomId} Not Found`);
      });
    const users = await this.userRepository.find({
      where: {
        id: In([room.host, ...room.admin, ...room.members]),
      },
    });
    const members = this.roomMembers(room, users);
    const roomDetail: RoomDetail = {
      id: room.id.toString(),
      name: room.name,
      roomtype: room.roomtype,
      memberCount: room.memberCount,
      members,
      history: room.messages,
    };
    return roomDetail;
  }

  async createRoom(roomInfo: RoomInfo) {
    const newRoomEntity = this.roomRepository.create({
      name: roomInfo.roomname,
      password: await this.genRoomPassword(roomInfo),
      roomtype: roomInfo.roomtype,
      host: +roomInfo.hostId,
    });
    const savedRoom = await this.roomRepository.save(newRoomEntity);
    this.appendRoomAtUserTable(savedRoom.host, savedRoom.id);
    return savedRoom.id.toString();
  }

  async updateRoom(roomInfo: RoomInfo) {
    const room = await this.roomRepository.findOneByOrFail({
      id: +roomInfo.roomId,
    });
    if (room.host.toString() !== roomInfo.hostId) {
      throw new ForbiddenException();
    }
    this.updateRoomEntity(roomInfo);
  }

  async roomOut(userId: number, roomId: number) {
    const room = await this.roomRepository.findOneByOrFail({ id: +roomId });
    if (room.host === userId) {
      // 나가려는 사용자가 host라면?
      // 1) admin 중 가장 빨리 들어온 사람
      // 2) member 중 가장 빨리 들어온 사람
      // 3) 방삭제
      if (room.memberCount === 1) {
        this.roomRepository.delete(roomId);
      } else {
        let newHost = -1;
        if (room.admin.length !== 0) {
          newHost = room.admin[0];
          this.roomRepository.update(roomId, {
            admin: () => `array_remove("admin", ${newHost})`,
          });
        } else {
          newHost = room.members[0];
          this.roomRepository.update(roomId, {
            members: () => `array_remove("members", ${newHost})`,
          });
        }
        this.roomRepository.update(roomId, {
          host: newHost,
        });
      }
    } else if (room.admin.includes(userId)) {
      this.roomRepository.update(roomId, {
        admin: () => `array_remove("admin", ${userId})`,
      });
    } else if (room.members.includes(userId)) {
      this.roomRepository.update(roomId, {
        members: () => `array_remove("members", ${userId})`,
      });
    } else {
      // room에 포함되지 않은 roomId
      throw new NotFoundException();
    }
    this.roomRepository.update(roomId, {
      memberCount: room.memberCount - 1,
    });
    // users - rooms 에서 room 삭제
    this.userRepository.update(userId, {
      rooms: () => `array_remove("rooms", ${roomId})`,
    });
  }

  private async appendRoomAtUserTable(userId: number, roomId: number) {
    this.userRepository.update(userId, {
      rooms: () => `array_append("rooms", ${roomId})`,
    });
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
    const salt = await bcrypt.genSalt(this.config.get<number>('SALT_ROUNDS'));
    return bcrypt.hash(pw, salt);
  }

  private async updateRoomEntity(updateValue: RoomInfo) {
    this.roomRepository.update(updateValue.roomId, {
      name: updateValue.roomname,
      password: await this.genRoomPassword(updateValue),
      roomtype: updateValue.roomtype,
    });
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
    return JSON.stringify(Object.fromEntries(members));
  }

  private userLevel(room: Rooms, user: Users) {
    let level: Level;
    switch (user.id) {
      case room.host:
        level = Level.HOST;
        break;
      case room.admin.includes(user.id) ? user.id : -1:
        level = Level.ADMIN;
      default:
        level = Level.MEMBER;
        break;
    }
    return level;
  }
}
