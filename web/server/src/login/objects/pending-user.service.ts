import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PendingUser } from './pending-user.object';

@Injectable()
export class PendingUserService {
  private users = new Map<number, PendingUser>();

  save(user: PendingUser) {
    user.authCode = this.generateRandomString(6);
    user.validity = new Date(new Date().getTime() + 5 * 60000);
    this.users.set(user.id, user);
  }

  verify(userId: number, emailCode: string) {
    const findUser = this.search(userId);
    const currentTime = new Date();
    if (!findUser) {
      throw new NotFoundException('NotFound');
    }
    if (currentTime > findUser.validity) {
      throw new NotFoundException('TimeOver');
    }
    if (emailCode !== findUser.authCode) {
      throw new UnauthorizedException('WrongCode');
    }
    this.delete(userId);
    this.deleteExpireUser();
    return findUser;
  }

  delete(userId: number) {
    this.users.delete(userId);
  }

  search(userId: number): PendingUser {
    return this.users.get(userId);
  }

  private async deleteExpireUser() {
    const currentTime = new Date();
    this.users.forEach((value, key) => {
      if (currentTime > value.validity) {
        this.delete(key);
      }
    });
  }

  private generateRandomString(length: number): string {
    if (process.env.NODE_ENV === 'dev') return '000000';

    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }
}
