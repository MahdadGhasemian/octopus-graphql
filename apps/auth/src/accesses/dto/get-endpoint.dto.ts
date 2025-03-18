import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetEndpointDto extends AbstractGetDto {
  @Field()
  tag?: string;

  @Field()
  path: string;

  @Field()
  method: string;
}
