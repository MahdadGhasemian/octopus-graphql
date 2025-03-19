import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, EVENT_NAME_USER_ACCESS_READ } from '../constants';
import { ReadUserAccessEvent } from '../events';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  private readonly logger = new Logger(JwtAccessGuard.name);

  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType<string>();
    let gqlContext;

    let user: any;
    let path: string;
    let method: string;
    // let pathKey: string;

    if (type === 'http') {
      // Extract data from HTTP request
      const request = context.switchToHttp().getRequest();
      path = request.originalUrl;
      method = request.method;
      user = request?.user;
    } else if (type === 'rpc') {
      // Extract data from RabbitMQ message
      const data = context.switchToRpc().getData();
      path = data?.path;
      method = data?.method;
      user = data?.user;
    } else if (type === 'graphql') {
      // Extract data from GraphQL request
      const ctx = GqlExecutionContext.create(context);
      gqlContext = ctx.getContext();
      path = gqlContext.req?.url || 'graphql';
      method = 'POST';
      user = gqlContext.req?.user;

      // const gqlInfo = ctx.getInfo();
      // pathKey = gqlInfo.path.key;
    } else {
      return false;
    }

    if (!user) {
      return false;
    }

    try {
      const accesses = await lastValueFrom(
        this.authClient.send(
          EVENT_NAME_USER_ACCESS_READ,
          new ReadUserAccessEvent(user.id),
        ),
      );

      const has_full_access = !!accesses?.find(
        (item: { has_full_access?: boolean }) => item.has_full_access,
      );

      if (!has_full_access) {
        const accessList = accesses?.flatMap(
          (item: { endpoints?: any[] }) => item.endpoints || [],
        );

        if (!this.hasAccess(method, path, accessList)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  hasAccess(method: string, path: string, accessList?: any[]) {
    if (!accessList?.length) return false;

    const exactMatch = accessList.find(
      (item) => item.path === path && item.method === method,
    );
    if (exactMatch) {
      return true;
    }

    const urlObject = new URL(path, 'http://localhost');
    const pathname = urlObject.pathname;

    for (const route of accessList) {
      if (pathname && route?.method) {
        const pattern = new RegExp(
          '^' + route.path?.replace(/{[^}]+}/g, '[^/]+') + '$',
        );

        if (pattern.test(pathname) && route.method === method) {
          return true;
        }
      }
    }

    return false;
  }
}
