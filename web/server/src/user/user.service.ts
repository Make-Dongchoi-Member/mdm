import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Users } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import {
  FriendData,
  MyData,
  OtherUserData,
  UserData,
} from 'src/types/interfaces';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * @TODO
   * 친구목록, 게임횟수, 승리횟수, 히스토리[상대, 승리여부, 시간]
   */
  async getMyData(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException(`user_id ${id} Not Found`);
    const friends = (await this.userRepository.getUserList(user.friends)).map(
      this.convertToFriendData,
    );
    const myData: MyData = {
      id: user.id,
      avatar: user.avatar,
      nickname: user.nickName,
      rooms: user.rooms,
      friends,
    };
    return myData;
  }
  /**
   * @TODO
   * 나와의 관계, 게임횟수, 승리횟수, 히스토리[상대, 승리여부, 시간]
   */
  async getUserData(id: number, nickName: string) {
    const other = await this.userRepository.getUserByNickname(nickName);
    if (!other) throw new NotFoundException(`nickname ${nickName} Not Found`);
    const otherUserData: OtherUserData = {
      id: other.id,
      avatar: other.avatar,
      nickname: other.nickName,
      relation: await this.userRepository.getRelation(id, other.id),
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

  async friendRequest(id: number, friendNickname: string) {
    const friend = await this.userRepository.getUserByNickname(friendNickname);
    this.userRepository.updateUser(id, {
      friends: () => `array_append("friends", ${friend.id})`,
    });
    this.userRepository.updateUser(friend.id, {
      friends: () => `array_append("friends", ${id})`,
    });
  }

  private convertToFriendData(user: Users): FriendData {
    return { nickname: user.nickName, avatar: user.avatar };
  }
}
