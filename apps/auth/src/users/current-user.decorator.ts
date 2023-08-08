import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from './models/user.schema';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as UserDocument;
  },
);
