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
import { CreateCustomer } from '../dto/create-customer.dto.js';
import { UpdateCustomer } from '../dto/update-customer.dto.js';
import { Customer } from '../entities/customer.entity.js';
import { CustomerPipe } from '../pipes/customer.pipe.js';
import { CustomerService } from '../services/customer.service.js';

@Controller('customer')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createCustomer: CreateCustomer) {
    return this.customerService.create(createCustomer);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  @SetMetadata('schema', 'customer')
  findAll(@Query() filters: IQuery) {
    return this.customerService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id', ParseIntPipe, CustomerPipe) customer: Customer,
    @Body() updateCustomer: UpdateCustomer,
  ) {
    return this.customerService.update(customer, updateCustomer);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe, CustomerPipe) customer: Customer) {
    return this.customerService.remove(customer);
  }
}
