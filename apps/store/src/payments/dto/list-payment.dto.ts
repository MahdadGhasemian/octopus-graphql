import { CacheControl, ListDto } from '@app/common';
import { GetPaymentDto } from './get-payment.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class ListPaymentDto extends ListDto<GetPaymentDto> {
  @Field(() => [GetPaymentDto])
  data: GetPaymentDto[];
}
