import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Rooms } from 'src/database/entities/room.entity';
import { Users } from 'src/database/entities/user.entity';
import { Level, RoomType } from 'src/types/enums';
import {
  Profile,
  RoomDetail,
  RoomInfo,
  RoomListInfo,
} from 'src/types/interfaces';
import { RoomRepository } from 'src/database/repositories/room.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
    ).filter((e) => e.roomtype === RoomType.PRIVATE);
    const roomList = Array<RoomListInfo>();
    [...publicRooms, ...userEnteredRooms].forEach((e) => {
      roomList.push({
        roomId: e.id.toString(),
        hostId: e.host.toString(),
        roomname: e.name,
        memberCount: e.memberCount,
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
      roomId: room.id.toString(),
      hostId: room.host.toString(),
      roomname: room.name,
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
    await this.roomRepository.updateRoomInfo(roomInfo);
  }

  async roomOut(userId: number, roomId: number) {
    const room = await this.roomRepository.getRoomById(roomId);
    if (!room) throw new NotFoundException(`room_id ${roomId} Not Found`);
    if (room.host === userId && room.memberCount === 1) {
      this.roomRepository.delete(roomId);
    } else {
      const updateData = this.roomOutUpdateData(userId, room);
      updateData.memberCount = room.memberCount - 1;
      await this.roomRepository.updateRoom(roomId, updateData);
    }
    await this.userRepository.removeRoom(userId, roomId);
  }

  async roomEnter(userId: number, roomId: number, password: string) {
    const room = await this.roomRepository.getRoomById(roomId);
    if (!room) throw new NotFoundException(`room_id ${roomId} Not Found`);
    if (room.roomtype === RoomType.LOCK)
      await this.checkPassword(room, password);
    this.roomRepository.updateRoom(roomId, {
      members: () => `array_append("members", ${userId})`,
      memberCount: room.memberCount + 1,
    });
    this.userRepository.updateUser(userId, {
      rooms: () => `array_append("rooms", ${roomId})`,
    });
  }

  private roomMembers(room: Rooms, users: Users[]) {
    const members: Map<string, Profile> = new Map();
    for (const user of users) {
      const profile: Profile = {
        user: {
          id: user.id,
          avatar: user.avatar,
          nickname: user.nickName,
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

  private roomOutUpdateData(
    userId: number,
    room: Rooms,
  ): QueryDeepPartialEntity<Rooms> {
    let updateData: QueryDeepPartialEntity<Rooms>;
    if (room.host === userId) {
      updateData = this.roomOutChangeHost(room);
    } else if (room.admin.includes(userId)) {
      updateData = { admin: () => `array_remove("admin", ${userId})` };
    } else if (room.members.includes(userId)) {
      updateData = { members: () => `array_remove("members", ${userId})` };
    } else {
      throw new ForbiddenException();
    }
    return updateData;
  }

  private roomOutChangeHost(room: Rooms) {
    let result: QueryDeepPartialEntity<Rooms>;
    if (room.admin.length !== 0) {
      result.host = room.admin[0];
      result.admin = () => `array_remove("admin", ${room.admin[0]})`;
    } else if (room.members.length !== 0) {
      result.host = room.members[0];
      result.members = () => `array_remove("members", ${room.members[0]})`;
    }
    return result;
  }

  private async checkPassword(room: Rooms, password: string) {
    const isCorrectPassword = await this.roomRepository.checkRoomPassword(
      password,
      room.password,
    );
    if (!isCorrectPassword) throw new ForbiddenException();
  }
}
