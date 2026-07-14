import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { Category } from './entities/category.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), SharedModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
