import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { CategoryService } from '../services/category.service.js';
import { CreateCategory } from '../dto/create-category.dto.js';
import { UpdateCategory } from '../dto/update-category.dto.js';
import { Category } from '../entities/category.entity.js';
import { CategoryPipe } from '../pipes/category.pipe.js';
import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter.js';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor.js';
import { PositiveIntPipe } from '../../shared/pipes/positive-int.pipe.js';

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
  findAll(
    @Query('page', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    page = 1,
    @Query('limit', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    limit = 10,
  ) {
    return this.categoryService.findAll(page, limit);
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
