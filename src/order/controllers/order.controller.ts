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
import { CreateOrder } from '../dto/create-order.dto.js';
import { UpdateOrder } from '../dto/update-order.dto.js';
import { Order } from '../entities/order.entity.js';
import { OrderPipe } from '../pipes/order.pipe.js';
import { OrderService } from '../services/order.service.js';

@Controller('order')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }), OrderPipe)
  create(@Body() createOrder: CreateOrder) {
    return this.orderService.create(createOrder);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  @SetMetadata('schema', 'order')
  findAll(@Query() filters: IQuery) {
    return this.orderService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id', ParseIntPipe, OrderPipe) order: Order,
    @Body() updateOrder: UpdateOrder,
  ) {
    return this.orderService.update(order, updateOrder);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe, OrderPipe) order: Order) {
    return this.orderService.remove(order);
  }
}
