import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class ConfirmOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  full_name?: string;

  @IsStrongPassword()
  @IsOptional()
  @Field(() => String)
  password?: string;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  confirmation_code: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  hashed_code: string;
}
