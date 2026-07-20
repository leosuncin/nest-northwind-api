import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { Category } from './entities/category.entity';
import { SharedModule } from '../shared/shared.module';
import { IsExistingCategoryConstraint } from './validators/is-existing-category.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), SharedModule],
  controllers: [CategoryController],
  providers: [CategoryService, IsExistingCategoryConstraint],
  exports: [CategoryService, IsExistingCategoryConstraint],
})
export class CategoryModule {}
