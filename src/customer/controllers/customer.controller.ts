import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { CustomerService } from '../services/customer.service';
import { CreateCustomer } from '../dto/create-customer.dto';
import { UpdateCustomer } from '../dto/update-customer.dto';
import { Customer } from '../entities/customer.entity';
import { CustomerPipe } from '../pipes/customer.pipe';
import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor';
import { PositiveIntPipe } from '../../shared/pipes/positive-int.pipe';

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
  findAll(
    @Query('page', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    page = 1,
    @Query('limit', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    limit = 10,
  ) {
    return this.customerService.findAll(page, limit);
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
