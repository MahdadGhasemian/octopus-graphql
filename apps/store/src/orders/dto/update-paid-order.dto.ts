import { IsBoolean, IsEnum } from 'class-validator';
import { OrderStatus } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateIsPaidOrderDto {
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus)
  order_status?: OrderStatus;

  @IsBoolean()
  @Field()
  is_paid?: boolean;
}
