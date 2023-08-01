import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Rooms } from 'src/database/entities/room.entity';
import { Users } from 'src/database/entities/user.entity';
import { Level, RoomType } from 'src/types/enums';
import { Profile, RoomDetail, RoomInfo } from 'src/types/interfaces';
import { ConfigService } from '@nestjs/config';
import { RoomRepository } from 'src/database/repositories/room.repository';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class ChatService {
  constructor(
    private roomRepository: RoomRepository,
    private userRepository: UserRepository,
  ) {}

  async getRoomListOfUser(userId: number) {
    const publicRooms = await this.roomRepository.publicRooms();
    const userEnteredRooms = (
      await this.roomRepository.userEnteredRooms(userId)
    ).filter((e) => {
      e.roomtype === RoomType.PRIVATE;
    });
    const roomList = Array<RoomInfo>();
    [...publicRooms, ...userEnteredRooms].forEach((e) => {
      roomList.push({
        roomId: e.id.toString(),
        hostId: e.host.toString(),
        roomname: e.name,
        password: '',
        roomtype: e.roomtype,
      });
    });
    return roomList;
  }

  async getRoomDetail(roomId: number) {
    const room = await this.roomRepository.getRoomById(roomId);
    if (!room) throw new NotFoundException(`room_id ${roomId} Not Found`);
    const ids = [room.host, ...room.admin, ...room.members];
    const users = await this.userRepository.getUserList(ids);
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
    const newRoom = await this.roomRepository.saveRoom(roomInfo);
    this.userRepository.appendRoomAtUser(newRoom.host, newRoom.id);
    return newRoom.id.toString();
  }

  async updateRoom(roomInfo: RoomInfo) {
    const room = await this.roomRepository.getRoomById(+roomInfo.roomId);
    if (!room) {
      throw new NotFoundException(`room_id ${roomInfo.roomId} Not Found`);
    } else if (room.host.toString() !== roomInfo.hostId) {
      throw new ForbiddenException();
    }
    await this.roomRepository.updateRoom(roomInfo);
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
