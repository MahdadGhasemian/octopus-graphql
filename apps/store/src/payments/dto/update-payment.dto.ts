import { CreatePaymentDto } from './create-payment.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
