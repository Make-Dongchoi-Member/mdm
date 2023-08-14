import { In, Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/decorators/customrepository.decorator';
import { PendingUser } from 'src/login/objects/pending-user.object';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Relation } from 'src/types/enums';

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

  async getUserById(id: number) {
    return this.findOne({ where: { id }, relations: { record: true } });
  }

  async getUserByNickname(nickName: string) {
    return this.findOne({ where: { nickName }, relations: { record: true } });
  }

  async getUserList(ids: number[]) {
    return this.findBy({ id: In(ids) });
  }

  async updateUser(id: number, updateData: QueryDeepPartialEntity<Users>) {
    const updateResult = await this.update(id, updateData);

    if (updateResult.affected === 0) {
      throw new NotFoundException(`user_id ${id} Not Found`);
    }
  }

  async isNickNameExist(nickName: string) {
    const user = await this.findOneBy({ nickName });
    return user !== null;
  }

  async appendRoomAtUser(userId: number, roomId: number) {
    this.update(userId, {
      rooms: () => `array_append("rooms", ${roomId})`,
    });
  }

  async removeRoom(userId: number, roomId: number) {
    this.update(userId, { rooms: () => `array_remove("rooms", ${roomId})` });
  }

  async getRelation(userId: number, otherId: number) {
    const user = await this.getUserById(userId);
    if (user.friends.includes(otherId)) {
      return Relation.FRIEND;
    } else if (user.blocks.includes(otherId)) {
      return Relation.BLOCK;
    } else {
      return Relation.NONE;
    }
  }

  async setSocketId(id: number, socket: string) {
    await this.update(id, { socket });
  }

  async unsetSocketId(socket: string) {
    const user = await this.findOneBy({ socket });
    if (user) {
      await this.update(user.id, { socket: null });
    }
  }
}
