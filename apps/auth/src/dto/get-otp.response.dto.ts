import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetOtpResponseDto {
  @Field()
  hashed_code: string;
}
