import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authenticationsService: {
      verifyUser(email: string, password: string);
    },
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    try {
      return this.authenticationsService.verifyUser(email, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
