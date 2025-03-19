import { Module } from '@nestjs/common';
import { AccessesModule } from '../accesses/accesses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Access, User } from '../libs';
import { AuthenticationsResolver } from './authentications.resolver';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationsController } from './authentications.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          algorithm: 'RS256',
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
        privateKey: configService
          .get<string>('JWT_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        publicKey: configService
          .get<string>('JWT_PUBLIC_KEY')
          .replace(/\\n/g, '\n'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Access]),
    AccessesModule,
    UsersModule,
  ],
  controllers: [AuthenticationsController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthenticationsResolver,
    AuthenticationsService,
    UsersService,
    UsersRepository,
  ],
})
export class AuthenticationsModule {}
