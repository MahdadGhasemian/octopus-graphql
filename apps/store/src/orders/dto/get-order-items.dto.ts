import { GetProductDto } from '../../products/dto/get-product.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractGetDto, CacheControl } from '@app/common';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class GetOrderItemDto extends AbstractGetDto {
  @Field()
  product_id: number;

  @Field(() => GetProductDto)
  product: GetProductDto;

  @Field()
  quantity: number;
}
