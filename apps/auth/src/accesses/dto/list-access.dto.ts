import { ListDto } from '@app/common';
import { GetAccessDto } from './get-access.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListAccessDto extends ListDto<GetAccessDto> {
  @Field(() => [GetAccessDto])
  data: GetAccessDto[];
}
