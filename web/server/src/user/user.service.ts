import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from 'src/configs/constants';
import { Users } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: Repository<Users>,
  ) {}

  async getInfoById(id: number) {
    const findUser = await this.userRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new NotFoundException(`user_id ${id} Not Found`);
      });
    return findUser;
  }

  async getInfoByNickName(nickName: string) {
    const findUser = await this.userRepository
      .findOneByOrFail({ nickName })
      .catch(() => {
        throw new NotFoundException(`nickname ${nickName} Not Found`);
      });
    return findUser;
  }

  async setNickname(id: number, nickName: string) {
    const alreadyExist = await this.userRepository.findOneBy({ nickName });
    if (alreadyExist) {
      throw new ConflictException(`nickname ${nickName} already exist`);
    }
    this.userRepository.update(id, { nickName });
  }

  async setStatus(id: number, status: string) {
    const updateResult = await this.userRepository.update(id, { status });
    if (updateResult.affected === 0) {
      throw new NotFoundException(`user_id ${id} Not Found`);
    }
  }

  async setAvatar(id: number, avatar: string) {
    const updateResult = await this.userRepository.update(id, { avatar });
    if (updateResult.affected === 0) {
      throw new NotFoundException(`user_id ${id} Not Found`);
    }
  }

  async setSkin(id: number, skin: number) {
    const updateResult = await this.userRepository.update(id, { skin });
    if (updateResult.affected === 0) {
      throw new NotFoundException(`user_id ${id} Not Found`);
    }
  }
}
