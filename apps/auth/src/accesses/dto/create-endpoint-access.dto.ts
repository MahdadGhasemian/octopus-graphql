import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateEndpointAccessDto {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  tag?: string;

  @IsString()
  @Field(() => String)
  path: string;

  @IsString()
  @Field(() => String)
  method: string;
}
