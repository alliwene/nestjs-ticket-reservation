import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDto } from '../dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as UserDto;
  },
);
