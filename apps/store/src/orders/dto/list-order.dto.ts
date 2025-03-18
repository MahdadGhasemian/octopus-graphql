import { ListDto } from '@app/common';
import { GetOrderDto } from './get-order.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListOrderDto extends ListDto<GetOrderDto> {
  @Field(() => [GetOrderDto])
  data: GetOrderDto[];
}
