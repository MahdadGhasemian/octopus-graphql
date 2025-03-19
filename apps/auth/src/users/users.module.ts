import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { AccessesModule } from '../accesses/accesses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../libs';
import { UsersResolver } from './users.resolver';
import { UsersController } from './users.controller';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User]), AccessesModule],
  controllers: [UsersController],
  providers: [UsersResolver, UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
