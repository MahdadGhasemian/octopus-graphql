import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Column, SortBy } from 'nestjs-paginate/lib/helper';
import { CacheControl } from '../decorators';

@ObjectType()
@Directive('@shareable')
@CacheControl({ inheritMaxAge: true })
export class MetaType<T> {
  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  sortBy?: SortBy<T>;

  @Field(() => [String], { nullable: true })
  searchBy?: Column<T>[];

  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => [String], { nullable: true })
  select?: string[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  filter?: string;
}

@ObjectType()
@Directive('@shareable')
@CacheControl({ inheritMaxAge: true })
export class LinksType {
  @Field(() => String, { nullable: true })
  first?: string;

  @Field(() => String, { nullable: true })
  previous?: string;

  @Field(() => String)
  current: string;

  @Field(() => String, { nullable: true })
  next?: string;

  @Field(() => String, { nullable: true })
  last?: string;
}

@ObjectType()
@CacheControl({ inheritMaxAge: true })
export class ListDto<T> {
  @Field(() => MetaType<T>)
  meta: MetaType<T>;

  @Field(() => LinksType)
  links: LinksType;
}
