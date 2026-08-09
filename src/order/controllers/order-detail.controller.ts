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
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter';
import { CreateOrderDetail } from '../dto/create-order-detail.dto';
import { UpdateOrderDetail } from '../dto/update-order-detail.dto';
import { OrderDetailService } from '../services/order-detail.service';

@Controller('order/:orderId/detail')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Get()
  findAll(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderDetailService.findAll(orderId);
  }

  @Get(':productId')
  findOne(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.orderDetailService.findOne(orderId, productId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() createOrderDetail: CreateOrderDetail,
  ) {
    return this.orderDetailService.create(orderId, createOrderDetail);
  }

  @Patch(':productId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateOrderDetail: UpdateOrderDetail,
  ) {
    return this.orderDetailService.update(
      orderId,
      productId,
      updateOrderDetail,
    );
  }

  @Delete(':productId')
  remove(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.orderDetailService.remove(orderId, productId);
  }
}
