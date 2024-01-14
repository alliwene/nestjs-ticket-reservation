import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return request.user;
    }

    const user = context.getArgs()[2]?.req.headers?.user;
    if (user) {
      return JSON.parse(user);
    }
  },
);
