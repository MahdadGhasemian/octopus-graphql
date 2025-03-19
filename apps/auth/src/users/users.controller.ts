import { Controller, UseInterceptors } from '@nestjs/common';
import {
  EVENT_NAME_USER_ACCESS_READ,
  MessageAckInterceptor,
  ReadUserAccessEvent,
} from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(EVENT_NAME_USER_ACCESS_READ)
  @UseInterceptors(MessageAckInterceptor)
  async readUserAccess(@Payload() payload: ReadUserAccessEvent) {
    return this.usersService.getAccessesAndEndpointsByUserId(payload.user_id);
  }
}
