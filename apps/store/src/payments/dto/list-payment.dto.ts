import { ListDto } from '@app/common';
import { GetPaymentDto } from './get-payment.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListPaymentDto extends ListDto<GetPaymentDto> {
  @Field(() => [GetPaymentDto])
  data: GetPaymentDto[];
}
