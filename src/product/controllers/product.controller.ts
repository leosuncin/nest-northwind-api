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

import { CategoryPipe } from '../../category/pipes/category.pipe.js';
import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter.js';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor.js';
import { SupplierPipe } from '../../supplier/pipes/supplier.pipe.js';
import { CreateProduct } from '../dto/create-product.dto.js';
import { UpdateProduct } from '../dto/update-product.dto.js';
import { Product } from '../entities/product.entity.js';
import { ProductPipe } from '../pipes/product.pipe.js';
import { ProductService } from '../services/product.service.js';

@Controller('product')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({ transform: true, whitelist: true }),
    CategoryPipe,
    SupplierPipe,
  )
  create(@Body() createProduct: CreateProduct) {
    return this.productService.create(createProduct);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  @SetMetadata('schema', 'product')
  findAll(@Query() filters: IQuery) {
    return this.productService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id', ParseIntPipe, ProductPipe) product: Product,
    @Body() updateProduct: UpdateProduct,
  ) {
    return this.productService.update(product, updateProduct);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe, ProductPipe) product: Product) {
    return this.productService.remove(product);
  }
}
