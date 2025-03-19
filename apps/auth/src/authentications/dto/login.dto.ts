import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

@InputType()
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsStrongPassword()
  @Field(() => String)
  password: string;
}
