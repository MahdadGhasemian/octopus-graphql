import { AbstractGetDto, PaymentStatus } from '@app/common';
import { GetOrderDto } from '../../orders/dto/get-order.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPaymentDto extends AbstractGetDto {
  @Field()
  amount?: number;

  @Field()
  paid_date?: Date;

  @Field(() => PaymentStatus)
  payment_status?: PaymentStatus;

  @Field()
  order_id?: number;

  @Field()
  order?: GetOrderDto;

  @Field(() => String, { nullable: true })
  description?: string;
}
