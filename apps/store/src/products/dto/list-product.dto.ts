import { ListDto } from '@app/common';
import { GetProductDto } from './get-product.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListProductDto extends ListDto<GetProductDto> {
  @Field(() => [GetProductDto])
  data: GetProductDto[];
}
