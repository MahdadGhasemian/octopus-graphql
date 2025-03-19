import { UseGuards } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { GetOtpDto } from './dto/get-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { CacheControl, CurrentUser } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { GetUserDto } from '../users/dto/get-user.dto';
import { EditInfoDto } from './dto/edit-info.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '../libs';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetOtpResponseDto } from './dto/get-otp.response.dto';

@Resolver()
export class AuthenticationsResolver {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}

  @Mutation(() => GetOtpResponseDto, { name: 'otp' })
  async getOtp(@Args('getOtpDto') getOtpDto: GetOtpDto) {
    return this.authenticationsService.getOtp(getOtpDto);
  }

  @Mutation(() => GetUserDto, { name: 'confirm' })
  async confirmOtp(
    @Args('confirmOtpDto') confirmOtpDto: ConfirmOtpDto,
    @Context() context: any,
  ) {
    const { res } = context;

    return this.authenticationsService.confirmOtp(confirmOtpDto, res);
  }

  @Mutation(() => GetUserDto, { name: 'changePassowrd' })
  @UseGuards(JwtAuthGuard)
  async changePassowrd(
    @CurrentUser() user: User,
    @Args('changePasswordDto') changePasswordDto: ChangePasswordDto,
    @Context() context: any,
  ) {
    const { res } = context;

    return this.authenticationsService.changePassword(
      changePasswordDto,
      res,
      user,
    );
  }

  @Mutation(() => GetUserDto, { name: 'login' })
  async login(@Args('loginDto') loginDto: LoginDto, @Context() context: any) {
    const { res } = context;

    return this.authenticationsService.login(loginDto, res);
  }

  @Mutation(() => GetUserDto, { name: 'logout', nullable: true })
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context: any) {
    const { res } = context;

    this.authenticationsService.logout(res);
  }

  @Query(() => GetUserDto, { name: 'info' })
  @UseGuards(JwtAuthGuard)
  @CacheControl({ maxAge: 100 })
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => GetUserDto, { name: 'info' })
  @UseGuards(JwtAuthGuard)
  async editInfo(
    @CurrentUser() user: User,
    @Args('editInfoDto') editInfoDto: EditInfoDto,
  ) {
    return this.authenticationsService.editInfo(editInfoDto, user);
  }
}
