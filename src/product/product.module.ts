import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '../category/category.module';
import { SharedModule } from '../shared/shared.module';
import { SupplierModule } from '../supplier/supplier.module';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { ProductService } from './services/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    SharedModule,
    CategoryModule,
    SupplierModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
