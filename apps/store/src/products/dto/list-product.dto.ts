import { CacheControl, ListDto } from '@app/common';
import { GetProductDto } from './get-product.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class ListProductDto extends ListDto<GetProductDto> {
  @Field(() => [GetProductDto])
  data: GetProductDto[];
}
