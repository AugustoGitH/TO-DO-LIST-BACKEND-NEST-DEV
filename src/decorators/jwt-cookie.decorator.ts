import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtTokenFromCookie = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies['access_token'];
  },
);
