import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter.js';
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
  findAll(@Param('orderId', PositiveIntPipe) orderId: number) {
    return this.orderDetailService.findAll(orderId);
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
