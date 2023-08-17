import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DMRooms } from 'src/database/entities/dm-room.entity';
import { GameHistory } from 'src/database/entities/game-history.entity';
import { Users } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { UserState } from 'src/types/enums';
import { MyData, OtherUserData, Record, UserData } from 'src/types/interfaces';
import { SearchUserDTO } from './dto/SearchUser.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getMyData(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException(`user_id ${id} Not Found`);
    const friends = (await this.userRepository.getUserList(user.friends)).map(
      this.convertToFriendData,
    );
    const record = user.record.map(this.convertToRecord);
    const myData: MyData = {
      id: user.id,
      avatar: user.avatar,
      nickname: user.nickName,
      rooms: user.rooms,
      friends,
      record,
      isAlert: user.isAlert,
    };
    return myData;
  }

  async getUserData(id: number, nickname: string) {
    const other = await this.userRepository.getUserByNickname(nickname);
    if (!other) throw new NotFoundException(`nickname ${nickname} Not Found`);
    const record = other.record.map(this.convertToRecord);
    const otherUserData: OtherUserData = {
      id: other.id,
      avatar: other.avatar,
      nickname: other.nickName,
      relation: await this.userRepository.getRelation(id, other.id),
      record,
      state: other.state as UserState,
    };
    return otherUserData;
  }

  async searchUser(nickname: string) {
    const user = await this.userRepository.getUserByNickname(nickname);
    const ret = new SearchUserDTO();
    if (!user) {
      ret.exist = false;
    } else {
      ret.exist = true;
      ret.user = {
        id: user.id,
        nickname: user.nickName,
        avatar: user.avatar,
      };
    }
    return ret;
  }

  async setNickname(id: number, nickname: string) {
    const alreadyExist = await this.userRepository.isNickNameExist(nickname);
    if (alreadyExist) {
      throw new ConflictException(`nickname ${nickname} already exist`);
    }
    this.userRepository.updateUser(id, { nickName: nickname });
  }

  async setStatus(id: number, status: UserState) {
    await this.userRepository.updateUser(id, { state: status });
  }

  async setAvatar(id: number, avatar: string) {
    await this.userRepository.updateUser(id, { avatar });
  }

  async setSkin(id: number, skin: number) {
    await this.userRepository.updateUser(id, { skin });
  }

  async friendDelete(id: number, friendNickname: string) {
    const me = await this.userRepository.getUserById(id);
    const friend = await this.userRepository.getUserByNickname(friendNickname);
    if (!me || !friend) throw new NotFoundException();
    me.friends = me.friends.filter((e) => e !== friend.id);
    friend.friends = friend.friends.filter((e) => e !== id);
    this.userRepository.save([me, friend]);
  }

  async blockRequest(id: number, userNickname: string) {
    const me = await this.userRepository.getUserById(id);
    const other = await this.userRepository.getUserByNickname(userNickname);
    if (!me || !other) throw new NotFoundException();
    me.friends = me.friends.filter((e) => e !== other.id);
    me.blocks.push(other.id);
    other.friends = other.friends.filter((e) => e !== id);
    this.userRepository.save([me, other]);
  }

  async blockCancel(id: number, userNickname: string) {
    const me = await this.userRepository.getUserById(id);
    const other = await this.userRepository.getUserByNickname(userNickname);
    if (!me || !other) throw new NotFoundException();
    me.blocks = me.blocks.filter((e) => e !== other.id);
    this.userRepository.save(me);
  }

  async friendRequest(id: number, friendNickname: string) {
    /**
     * @TODO
     * 이미 친구로 저장된 경우엔 무시
     */
    const friend = await this.userRepository.getUserByNickname(friendNickname);
    const me = await this.userRepository.getUserById(id);
    friend.friends.push(me.id);
    me.friends.push(friend.id);
    this.userRepository.save([friend, me]);
    // this.userRepository.updateUser(id, {
    //   friends: () => `array_append("friends", ${friend.id})`,
    // });
    // this.userRepository.updateUser(friend.id, {
    //   friends: () => `array_append("friends", ${id})`,
    // });
    const dmRooms = new DMRooms();
    dmRooms.users = [friend, me];
    dmRooms.messages = [];
    this.userRepository.manager.save(dmRooms);
  }

  async addGame(id: number, enemy: string) {
    const date = new Date();
    const win = date.getSeconds() % 2 === 0;
    const user = await this.userRepository.getUserById(id);
    const enemyUser = await this.userRepository.getUserByNickname(enemy);

    const myHistory = new GameHistory();
    myHistory.date = date;
    myHistory.win = win;
    myHistory.user = user;
    myHistory.enemy = enemyUser;

    const enemyHistory = new GameHistory();
    enemyHistory.date = date;
    enemyHistory.win = !win;
    enemyHistory.user = enemyUser;
    enemyHistory.enemy = user;

    await this.userRepository.manager.save([myHistory, enemyHistory]);
  }

  private convertToFriendData(user: Users): UserData {
    return { id: user.id, nickname: user.nickName, avatar: user.avatar };
  }

  private convertToRecord(history: GameHistory): Record {
    return {
      enemy: history.enemy.nickName,
      win: history.win,
      date: history.date,
    };
  }
}
