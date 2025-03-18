import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

@InputType()
export class CreateProductDto {
  @IsString()
  @Field(() => String)
  name: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Field(() => String, { nullable: true })
  image?: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  category_id?: number;

  @IsNumber()
  @Field(() => Float)
  price: number;

  @IsNumber()
  @Field(() => Float)
  sale_price: number;

  @IsBoolean()
  @Field(() => Boolean)
  is_active?: boolean;
}
