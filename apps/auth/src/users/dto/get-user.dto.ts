import { GetAccessDto } from '../../accesses/dto/get-access.dto';
import { AbstractGetDto, CacheControl } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class GetUserDto extends AbstractGetDto {
  @Field()
  email?: string;

  @Field()
  full_name?: string;

  @Field(() => [GetAccessDto])
  accesses?: GetAccessDto[];
}
