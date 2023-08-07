import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class SetNicknameValidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    if (!this.isValidNickname(value.nickname)) throw new BadRequestException();
    return value;
  }

  private isValidNickname(nickname: string): boolean {
    const regex = /^[a-zA-Z]+$/;

    if (nickname.length < 3 || nickname.length > 10) return false;

    if (!regex.test(nickname)) return false;

    return true;
  }
}
