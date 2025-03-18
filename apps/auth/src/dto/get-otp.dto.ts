import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetOtpDto {
  @Field()
  email: string;
}
