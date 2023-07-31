import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/decorators/customrepository.decorator';
import { PendingUser } from 'src/login/objects/pending-user.object';

@CustomRepository(Users)
export class UserRepository extends Repository<Users> {
  async saveNewUser(user: PendingUser) {
    const newUserEntity = this.create({
      id: user.id,
      userName: user.login,
      email: user.email,
      avatar: user.image,
    });
    return await this.save(newUserEntity);
  }

  async getInfoById(id: number) {
    const user = await this.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`user_id ${id} Not Found`);
    });
    return user;
  }

  async getInfoByNickname(nickName: string) {
    const user = await this.findOneByOrFail({ nickName }).catch(() => {
      throw new NotFoundException(`nickname ${nickName} Not Found`);
    });
    return user;
  }

  async updateUser(id: number, updateData: Partial<Users>) {
    const updateResult = await this.update(id, updateData);

    if (updateResult.affected === 0) {
      throw new NotFoundException(`user_id ${id} Not Found`);
    }
  }

  async isNickNameExist(nickName: string) {
    const user = await this.findOneBy({ nickName });
    return user !== null;
  }
}
