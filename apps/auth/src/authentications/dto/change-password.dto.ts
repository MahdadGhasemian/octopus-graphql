import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class ChangePasswordDto {
  @IsStrongPassword()
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
