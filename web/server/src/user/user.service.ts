import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getInfoById(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException(`user_id ${id} Not Found`);
    return user;
  }

  async getInfoByNickName(nickName: string) {
    const user = await this.userRepository.getUserByNickname(nickName);
    if (!user) throw new NotFoundException(`nickname ${nickName} Not Found`);
  }

  async setNickname(id: number, nickName: string) {
    const alreadyExist = await this.userRepository.isNickNameExist(nickName);
    if (alreadyExist) {
      throw new ConflictException(`nickname ${nickName} already exist`);
    }
    this.userRepository.update(id, { nickName });
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
