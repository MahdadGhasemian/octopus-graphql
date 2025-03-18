import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GetProductDto } from '../../products/dto/get-product.dto';

@ObjectType()
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
