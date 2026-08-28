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
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter.js';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor.js';
import { PositiveIntPipe } from '../../shared/pipes/positive-int.pipe.js';
import { CreateProduct } from '../dto/create-product.dto.js';
import { UpdateProduct } from '../dto/update-product.dto.js';
import { Product } from '../entities/product.entity.js';
import { ProductPipe } from '../pipes/product.pipe.js';
import { ProductService } from '../services/product.service.js';
import { SupplierPipe } from '../../supplier/pipes/supplier.pipe.js';
import { CategoryPipe } from '../../category/pipes/category.pipe.js';

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
  findAll(
    @Query('page', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    page = 1,
    @Query('limit', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    limit = 10,
  ) {
    return this.productService.findAll(page, limit);
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
