import { CacheControl, ListDto } from '@app/common';
import { GetUserDto } from './get-user.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class ListUserDto extends ListDto<GetUserDto> {
  @Field(() => [GetUserDto])
  data: GetUserDto[];
}
