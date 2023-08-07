import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/database/repositories/user.repository';
import { MyData, UserData } from 'src/types/interfaces';

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
    const myData: MyData = {
      id: user.id,
      avatar: user.avatar,
      nickname: user.nickName,
      rooms: user.rooms,
    };
    return myData;
  }
  /**
   * @TODO
   * 나와의 관계, 게임횟수, 승리횟수, 히스토리[상대, 승리여부, 시간]
   */
  async getUserData(nickName: string) {
    const user = await this.userRepository.getUserByNickname(nickName);
    if (!user) throw new NotFoundException(`nickname ${nickName} Not Found`);
    const userData: UserData = {
      id: user.id,
      avatar: user.avatar,
      nickname: user.nickName,
    };
    return userData;
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
}
