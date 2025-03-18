import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  DatabaseModule,
  HealthModule,
  LoggerModule,
  RabbitmqModule,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PublicFilesModule } from './public-files/public-files.module';
import { PrivateFilesModule } from './private-files/private-files.module';
import * as Joi from 'joi';
import { MinioModule } from 'nestjs-minio-client';
import { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { GqlModuleOptions, GraphQLModule, Int } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLUpload } from 'graphql-upload-minimal';
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

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_STORAGE: Joi.number().required(),
        UPLOAD_FILE_MAX_SIZE: Joi.number().required(),
        BASE_PUBLIC_URL_DOWNLOAD: Joi.string().required(),
        BASE_PRIVATE_URL_DOWNLOAD: Joi.string().required(),
        REDIS_CACHE_KEY_PREFIX_STORAGE: Joi.string().required(),
        GRAPHQL_SCHEMA_FILE_STORAGE: Joi.string().optional(),
      }),
    }),
    RabbitmqModule.forRoot(AUTH_SERVICE, 'RABBITMQ_AUTH_QUEUE_NAME'),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          ttl: configService.get<number>('REDIS_CACHE_TTL_GLOBAL') || 60000,
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
        }),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORAGE'),
      }),
      inject: [ConfigService],
    }),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get<string>('MINIO_ENDPOINT'),
        port: parseInt(configService.get<string>('MINIO_PORT')),
        useSSL: configService.get<string>('MINIO_USE_SSL') === 'true',
        accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
        secretKey: configService.get<string>('MINIO_SECRET_KEY'),
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
            'GRAPHQL_SCHEMA_FILE_STORAGE',
            'schema.gql',
          ),
          sortSchema: true,
          context: ({ req, res }) => ({ req, res }),
          cors: {
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
          },
          csrfPrevention: false, // Disable CSRF protection
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
    HealthModule.forRoot('RABBITMQ_STORAGE_QUEUE_NAME', 'healthStorage'),
    PublicFilesModule,
    PrivateFilesModule,
  ],
  providers: [
    {
      provide: 'Upload',
      useValue: GraphQLUpload,
    },
  ],
})
export class StorageModule {}
