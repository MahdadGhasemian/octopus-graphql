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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessGuard implements CanActivate {
  private readonly logger = new Logger(AccessGuard.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType<string>();
    let gqlContext;

    let user: any;
    let operation_type: string;
    let operation_name: string;

    if (type === 'graphql') {
      // Extract data from GraphQL request
      const ctx = GqlExecutionContext.create(context);
      gqlContext = ctx.getContext();
      user = gqlContext.req?.user;

      operation_type = String(ctx.getInfo().path.typename).toLowerCase();
      operation_name = ctx.getInfo().path.key;
    } else {
      return false;
    }

    if (!user) {
      return false;
    }

    try {
      // Read Access From Cache or Retrieve by Broker Message
      const cache_prefix = this.configService.get<string>(
        'REDIS_CACHE_KEY_PREFIX_AUTH',
      );
      const cache_ttl = this.configService.get<number>(
        'REDIS_CACHE_TTL_GLOBAL',
      );
      const cache_key = `${cache_prefix}:user_accesses:user_id:${user.id}`;

      // Read from cache
      const accessesString = await this.cacheManager.get<string>(cache_key);

      let accesses;
      if (accessesString) {
        // Use cache value
        try {
          accesses = JSON.parse(accessesString);
        } catch (error) {
          this.logger.error('Error parsing cached access data:', error);
          accesses = null;
        }
      } else {
        // Retrieve access if not persisted
        accesses = await lastValueFrom(
          this.authClient.send(
            EVENT_NAME_USER_ACCESS_READ,
            new ReadUserAccessEvent(user.id),
          ),
        );

        // Write cache value
        await this.cacheManager.set(
          cache_key,
          JSON.stringify(accesses),
          cache_ttl,
        );
      }
      //

      const has_full_access = !!accesses?.find(
        (item: { has_full_access?: boolean }) => item.has_full_access,
      );

      if (!has_full_access) {
        const accessList = accesses?.flatMap(
          (item: { endpoints?: any[] }) => item.endpoints || [],
        );

        return accessList?.some(
          (item) =>
            item.operation_type === operation_type &&
            item.operation_name === operation_name,
        );
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
