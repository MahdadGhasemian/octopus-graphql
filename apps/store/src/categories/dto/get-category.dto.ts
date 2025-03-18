import { AbstractGetDto, CacheControl } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GetProductDto } from '../../products/dto/get-product.dto';

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class GetCategoryDto extends AbstractGetDto {
  @Field()
  name?: string;

  @Field()
  description?: string;

  @Field()
  image?: string;

  @Field(() => [GetProductDto], { nullable: true })
  products?: GetProductDto[];
}
