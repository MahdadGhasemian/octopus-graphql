import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const type = context.getType<string>();
    if (type === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const gqlArgs = ctx.getArgs();

      const req = ctx.getContext().req;

      req.body = {
        ...gqlArgs.loginDto,
      };

      return req;
    } else {
      return context.switchToHttp().getRequest();
    }
  }
}
