import { AbstractGetDto, CacheControl } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class GetEndpointDto extends AbstractGetDto {
  @Field()
  tag?: string;

  @Field()
  operation_type: string;

  @Field()
  operation_name: string;
}
