import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsString()
  @Field(() => String)
  full_name: string;

  @IsStrongPassword()
  @Field(() => String)
  password?: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @Field(() => [Int])
  access_ids: number[];
}
