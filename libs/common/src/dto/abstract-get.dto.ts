import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CacheControl } from '../decorators';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class AbstractGetDto {
  @Field(() => Int)
  id?: number;

  @Field()
  created_at?: Date;

  @Field()
  updated_at?: Date;
}
