import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDto } from '../dto';

const getCurrentUserByContext = (context: ExecutionContext) => {
  if (context.getType() === 'http') {
    const request = context.switchToHttp().getRequest();
    return request.user as UserDto;
  }

  const user = context.getArgs()[2]?.req.headers?.user;
  if (user) {
    return JSON.parse(user);
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    getCurrentUserByContext(context);
  },
);
