import { ListDto } from '@app/common';
import { GetCategoryDto } from './get-category.dto';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class ListCategoryDto extends ListDto<GetCategoryDto> {
  @Field(() => [GetCategoryDto])
  data: GetCategoryDto[];
}
