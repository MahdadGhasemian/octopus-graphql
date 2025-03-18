import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class EditInfoDto {
  @IsString()
  @Field(() => String)
  full_name?: string;
}
