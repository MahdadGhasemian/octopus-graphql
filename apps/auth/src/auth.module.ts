import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  DatabaseModule,
  HealthModule,
  HttpCacheInterceptor,
  LoggerModule,
  RabbitmqModule,
  REDIS_CACHE_KEY_PREFIX_AUTH,
  STORE_SERVICE,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { AccessesModule } from './accesses/accesses.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { GqlModuleOptions, GraphQLModule, Int } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import {
  DirectiveLocation,
  GraphQLBoolean,
  GraphQLDirective,
  GraphQLEnumType,
} from 'graphql';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import { AuthenticationsModule } from './authentications/authentications.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_AUTH: Joi.number().required(),
        JWT_PRIVATE_KEY: Joi.string().required(),
        JWT_PUBLIC_KEY: Joi.string().required(),
        OTP_EMAIL_EXPIRATION: Joi.number().required(),
        DEFAULT_ACCESS_ID: Joi.number().required(),
        REDIS_CACHE_KEY_PREFIX_AUTH: Joi.string().required(),
        POSTGRES_DATABASE_AUTH: Joi.string().required(),
        GRAPHQL_SCHEMA_FILE_AUTH: Joi.string().optional(),
      }),
    }),
    RabbitmqModule.forRoot(AUTH_SERVICE, 'RABBITMQ_AUTH_QUEUE_NAME'),
    RabbitmqModule.forRoot(STORE_SERVICE, 'RABBITMQ_STORE_QUEUE_NAME'),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          ttl: configService.get<number>('REDIS_CACHE_TTL_GLOBAL') || 60000,
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
        }),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.get('POSTGRES_DATABASE_AUTH'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        const redisUri = `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`;

        // Create a Keyv instance with Redis
        const keyvInstance = new Keyv({
          store: new KeyvRedis(redisUri),
        });

        // Wrap Keyv with KeyvAdapter for Apollo compatibility
        const keyvCache = new KeyvAdapter(keyvInstance);

        return {
          autoSchemaFile: configService.get<string>(
            'GRAPHQL_SCHEMA_FILE_AUTH',
            'schema.gql',
          ),
          sortSchema: true,
          context: ({ req, res }) => ({ req, res }),
          cors: {
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
          },
          plugins: [
            ApolloServerPluginCacheControl(),
            // ApolloServerPluginCacheControl({ defaultMaxAge: 100 }),
            responseCachePlugin({
              cache: keyvCache,
              sessionId: async (requestContext) => {
                const req = requestContext.request.http;
                if (!req) return null;

                const cookies = req.headers.get('cookie') || '';
                const cookieAuth = cookies
                  .split('; ')
                  .find((c) => c.startsWith('Authentication='))
                  ?.split('=')[1];

                const headerAuth = req.headers.get('Authentication');

                return cookieAuth || headerAuth || null;
              },
            }),
          ],
          buildSchemaOptions: {
            directives: [
              new GraphQLDirective({
                name: 'cacheControl',
                args: {
                  maxAge: { type: Int },
                  scope: {
                    type: new GraphQLEnumType({
                      name: 'CacheControlScope',
                      values: {
                        PUBLIC: {},
                        PRIVATE: {},
                      },
                    }),
                  },
                  inheritMaxAge: { type: GraphQLBoolean },
                },
                locations: [
                  DirectiveLocation.FIELD_DEFINITION,
                  DirectiveLocation.OBJECT,
                  DirectiveLocation.INTERFACE,
                  DirectiveLocation.UNION,
                  DirectiveLocation.QUERY,
                ],
              }),
            ],
          },
        } as GqlModuleOptions;
      },
      inject: [ConfigService],
    }),
    HealthModule.forRoot('RABBITMQ_AUTH_QUEUE_NAME', 'healthAuth'),
    AuthenticationsModule,
    UsersModule,
    AccessesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (cacheManager: any, reflector: Reflector) => {
        return new HttpCacheInterceptor(
          REDIS_CACHE_KEY_PREFIX_AUTH,
          cacheManager,
          reflector,
        );
      },
      inject: [CACHE_MANAGER, Reflector],
    },
  ],
})
export class AuthModule {}
