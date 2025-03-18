import { CacheControl, ListDto } from '@app/common';
import { GetCategoryDto } from './get-category.dto';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class ListCategoryDto extends ListDto<GetCategoryDto> {
  @Field(() => [GetCategoryDto])
  data: GetCategoryDto[];
}
