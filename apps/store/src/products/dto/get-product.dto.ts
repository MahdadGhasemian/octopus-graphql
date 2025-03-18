import { GetCategoryDto } from '../../categories/dto/get-category.dto';
import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetProductDto extends AbstractGetDto {
  @Field()
  name?: string;

  @Field()
  description?: string;

  @Field()
  image?: string;

  @Field()
  category_id?: number;

  @Field(() => GetCategoryDto, { nullable: true })
  category?: GetCategoryDto;

  @Field()
  price?: number;

  @Field()
  sale_price?: number;

  @Field()
  is_active?: boolean;
}
