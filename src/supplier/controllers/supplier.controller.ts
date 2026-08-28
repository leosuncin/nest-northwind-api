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
import { CreateSupplier } from '../dto/create-supplier.dto.js';
import { UpdateSupplier } from '../dto/update-supplier.dto.js';
import { Supplier } from '../entities/supplier.entity.js';
import { SupplierPipe } from '../pipes/supplier.pipe.js';
import { SupplierService } from '../services/supplier.service.js';

@Controller('supplier')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createSupplier: CreateSupplier) {
    return this.supplierService.create(createSupplier);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll(
    @Query('page', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    page = 1,
    @Query('limit', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    limit = 10,
  ) {
    return this.supplierService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id', ParseIntPipe, SupplierPipe) supplier: Supplier,
    @Body() updateSupplier: UpdateSupplier,
  ) {
    return this.supplierService.update(supplier, updateSupplier);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe, SupplierPipe) supplier: Supplier) {
    return this.supplierService.remove(supplier);
  }
}
