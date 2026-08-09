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

import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor';
import { PositiveIntPipe } from '../../shared/pipes/positive-int.pipe';
import { CreateOrder } from '../dto/create-order.dto';
import { UpdateOrder } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { OrderCreatePipe } from '../pipes/order-create.pipe';
import { OrderPipe } from '../pipes/order.pipe';
import { OrderService } from '../services/order.service';

@Controller('order')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({ transform: true, whitelist: true }),
    OrderCreatePipe,
  )
  create(@Body() createOrder: CreateOrder) {
    return this.orderService.create(createOrder);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll(
    @Query('page', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    page = 1,
    @Query('limit', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    limit = 10,
  ) {
    return this.orderService.findAll(page, limit);
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
