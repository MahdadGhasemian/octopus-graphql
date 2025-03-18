import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GraphqlUploadPublicFileResponseDto {
  @Field(() => String, { nullable: true })
  bucket_name: string;

  @Field(() => String, { nullable: true })
  object_name: string;

  @Field(() => Int, { nullable: true })
  size: number;

  @Field(() => String, { nullable: true })
  url: string;
}
