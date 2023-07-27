import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return +request.user_id;
});
