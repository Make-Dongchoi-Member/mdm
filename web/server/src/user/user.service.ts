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
    return await this.userRepository.getInfoById(id);
  }

  async getInfoByNickName(nickName: string) {
    return await this.userRepository.getInfoByNickname(nickName as string);
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
