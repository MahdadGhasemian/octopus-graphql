import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GetEndpointDto } from './get-endpoint.dto';

@ObjectType()
export class GetAccessDto extends AbstractGetDto {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => Boolean, { nullable: true })
  cannot_be_deleted?: boolean;

  @Field({ nullable: true })
  has_full_access?: boolean;

  @Field(() => [GetEndpointDto])
  endpoints?: GetEndpointDto[];
}
