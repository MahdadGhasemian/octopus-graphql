import { ListDto } from '@app/common';
import { GetUserDto } from './get-user.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListUserDto extends ListDto<GetUserDto> {
  @Field(() => [GetUserDto])
  data: GetUserDto[];
}
