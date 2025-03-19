import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../libs';
import { ProductsResolver } from './products.resolver';
import { CategoriesService } from '../categories/categories.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
  ],
  providers: [
    ProductsService,
    ProductsRepository,
    ProductsResolver,
    CategoriesService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
