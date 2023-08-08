import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameHistory } from 'src/database/entities/game-history.entity';
import { Users } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import {
  FriendData,
  MyData,
  OtherUserData,
  Record,
} from 'src/types/interfaces';

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
    };
    return myData;
  }

  async getUserData(id: number, nickName: string) {
    const other = await this.userRepository.getUserByNickname(nickName);
    if (!other) throw new NotFoundException(`nickname ${nickName} Not Found`);
    const record = other.record.map(this.convertToRecord);
    const otherUserData: OtherUserData = {
      avatar: other.avatar,
      nickname: other.nickName,
      relation: await this.userRepository.getRelation(id, other.id),
      record,
    };
    return otherUserData;
  }

  async setNickname(id: number, nickName: string) {
    const alreadyExist = await this.userRepository.isNickNameExist(nickName);
    if (alreadyExist) {
      throw new ConflictException(`nickname ${nickName} already exist`);
    }
    this.userRepository.updateUser(id, { nickName });
  }

  async setStatus(id: number, status: string) {
    await this.userRepository.updateUser(id, { status });
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
    const friend = await this.userRepository.getUserByNickname(friendNickname);
    this.userRepository.updateUser(id, {
      friends: () => `array_append("friends", ${friend.id})`,
    });
    this.userRepository.updateUser(friend.id, {
      friends: () => `array_append("friends", ${id})`,
    });
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

  private convertToFriendData(user: Users): FriendData {
    return { nickname: user.nickName, avatar: user.avatar };
  }

  private convertToRecord(history: GameHistory): Record {
    return {
      enemy: history.enemy.nickName,
      win: history.win,
      date: history.date,
    };
  }
}
