import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationsService } from '../authentications/authentications.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationsService: AuthenticationsService) {
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
