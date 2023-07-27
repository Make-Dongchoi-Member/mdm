import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
}
