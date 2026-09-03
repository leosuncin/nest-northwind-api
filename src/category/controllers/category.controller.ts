import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { IQuery } from '@rapiq/core';

import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter.js';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor.js';
import { CreateCategory } from '../dto/create-category.dto.js';
import { UpdateCategory } from '../dto/update-category.dto.js';
import { Category } from '../entities/category.entity.js';
import { CategoryPipe } from '../pipes/category.pipe.js';
import { CategoryService } from '../services/category.service.js';

@Controller('category')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createCategory: CreateCategory) {
    return this.categoryService.create(createCategory);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  @SetMetadata('schema', 'category')
  findAll(@Query() filters: IQuery) {
    return this.categoryService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id', CategoryPipe) category: Category,
    @Body() updateCategory: UpdateCategory,
  ) {
    return this.categoryService.update(category, updateCategory);
  }

  @Delete(':id')
  remove(@Param('id', CategoryPipe) category: Category) {
    return this.categoryService.remove(category);
  }
}
