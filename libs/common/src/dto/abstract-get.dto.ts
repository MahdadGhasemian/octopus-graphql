import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AbstractGetDto {
  @Field(() => Int)
  id?: number;

  @Field()
  created_at?: Date;

  @Field()
  updated_at?: Date;
}
