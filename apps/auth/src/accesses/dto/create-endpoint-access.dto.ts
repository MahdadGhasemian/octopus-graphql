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
  operation_type: string;

  @IsString()
  @Field(() => String)
  operation_name: string;
}
