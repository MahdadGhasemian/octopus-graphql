import { CacheControl, ListDto } from '@app/common';
import { GetOrderDto } from './get-order.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class ListOrderDto extends ListDto<GetOrderDto> {
  @Field(() => [GetOrderDto])
  data: GetOrderDto[];
}
