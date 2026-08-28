import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '../category/category.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { SupplierModule } from '../supplier/supplier.module.js';
import { ProductController } from './controllers/product.controller.js';
import { Product } from './entities/product.entity.js';
import { ProductService } from './services/product.service.js';
import { IsExistingProductConstraint } from './validators/is-existing-product.validator.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    SharedModule,
    CategoryModule,
    SupplierModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, IsExistingProductConstraint],
  exports: [IsExistingProductConstraint],
})
export class ProductModule {}
