import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import type { IQuery } from '@rapiq/core';

import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter.js';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor.js';
import { PositiveIntPipe } from '../../shared/pipes/positive-int.pipe.js';
import { CreateOrderDetail } from '../dto/create-order-detail.dto.js';
import { UpdateOrderDetail } from '../dto/update-order-detail.dto.js';
import { OrderDetail } from '../entities/order-detail.entity.js';
import { OrderDetailPipe } from '../pipes/order-detail.pipe.js';
import { OrderDetailService } from '../services/order-detail.service.js';

@Controller('order/:orderId/detail')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  @SetMetadata('schema', 'order-detail')
  findAll(
    @Param('orderId', PositiveIntPipe) orderId: number,
    @Query() filters: IQuery,
  ) {
    return this.orderDetailService.findAll(orderId, filters);
  }

  @Get(':productId')
  findOne(@Param(OrderDetailPipe) orderDetail: OrderDetail) {
    return orderDetail;
  }

  @Post()
  create(
    @Param('orderId', PositiveIntPipe) orderId: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createOrderDetail: CreateOrderDetail,
  ) {
    return this.orderDetailService.create(orderId, createOrderDetail);
  }

  @Patch(':productId')
  update(
    @Param(OrderDetailPipe) detail: OrderDetail,
    @Body(
      new ValidationPipe({ transform: true, whitelist: true }),
      new OrderDetailPipe(),
    )
    updateOrderDetail: UpdateOrderDetail,
  ) {
    return this.orderDetailService.update(detail, updateOrderDetail);
  }

  @Delete(':productId')
  remove(@Param(OrderDetailPipe) detail: OrderDetail) {
    return this.orderDetailService.remove(detail);
  }
}
