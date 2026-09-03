import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module.js';
import { CategoryController } from './controllers/category.controller.js';
import { queryCategorySchema } from './dto/query-category.dto.js';
import { Category } from './entities/category.entity.js';
import { CategoryService } from './services/category.service.js';
import { IsExistingCategoryConstraint } from './validators/is-existing-category.validator.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    SharedModule.forFeature(queryCategorySchema),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, IsExistingCategoryConstraint],
  exports: [CategoryService, IsExistingCategoryConstraint],
})
export class CategoryModule {}
