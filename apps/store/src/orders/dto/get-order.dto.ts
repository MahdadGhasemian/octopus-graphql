import { AbstractGetDto, CacheControl, OrderStatus } from '@app/common';
import { GetOrderItemDto } from './get-order-items.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class GetOrderDto extends AbstractGetDto {
  @Field()
  order_date?: Date;

  @Field(() => [GetOrderItemDto])
  order_items?: GetOrderItemDto[];

  @Field()
  total_bill_amount?: number;

  @Field(() => OrderStatus)
  order_status?: OrderStatus;

  @Field()
  is_paid?: boolean;

  @Field()
  note?: string;
}
