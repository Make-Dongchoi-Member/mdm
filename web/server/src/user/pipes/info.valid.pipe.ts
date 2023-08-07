import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class InfoValidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isValidNickname(value)) throw new BadRequestException();

    return value;
  }

  private isValidNickname(nickname: string): boolean {
    const regex = /^[a-zA-Z]+$/;

    if (nickname.length < 3 || nickname.length > 10) return false;

    if (!regex.test(nickname)) return false;

    return true;
  }
}
