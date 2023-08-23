import {
  Injectable,
  CanActivate,
  ExecutionContext,
  applyDecorators,
  UseGuards,
  SetMetadata,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LimitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const limit = this.reflector.get<string[]>('limit', context.getHandler());
    console.log('bytesRead', request.socket.bytesRead);
    console.log('limit', limit);
    if (limit < request.socket.bytesRead) {
      throw new PayloadTooLargeException();
    }
    return true;
  }
}

export const Limit = (limit: number) =>
  applyDecorators(UseGuards(LimitGuard), SetMetadata('limit', limit));
