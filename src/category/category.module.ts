import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './services/category.service.js';
import { CategoryController } from './controllers/category.controller.js';
import { Category } from './entities/category.entity.js';
import { SharedModule } from '../shared/shared.module.js';
import { IsExistingCategoryConstraint } from './validators/is-existing-category.validator.js';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), SharedModule],
  controllers: [CategoryController],
  providers: [CategoryService, IsExistingCategoryConstraint],
  exports: [CategoryService, IsExistingCategoryConstraint],
})
export class CategoryModule {}
