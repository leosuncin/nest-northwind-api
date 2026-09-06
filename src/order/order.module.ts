import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerModule } from '../customer/customer.module.js';
import { EmployeeModule } from '../employee/employee.module.js';
import { ProductModule } from '../product/product.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { ShipperModule } from '../shipper/shipper.module.js';
import { OrderDetailController } from './controllers/order-detail.controller.js';
import { OrderController } from './controllers/order.controller.js';
import { queryOrderDetailSchema } from './dto/query-order-detail.dto.js';
import { queryOrderSchema } from './dto/query-order.dto.js';
import { OrderDetail } from './entities/order-detail.entity.js';
import { Order } from './entities/order.entity.js';
import { OrderPipe } from './pipes/order.pipe.js';
import { OrderDetailService } from './services/order-detail.service.js';
import { OrderService } from './services/order.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    SharedModule.forFeature(queryOrderSchema, queryOrderDetailSchema),
    CustomerModule,
    EmployeeModule,
    ShipperModule,
    ProductModule,
  ],
  controllers: [OrderController, OrderDetailController],
  providers: [OrderService, OrderDetailService, OrderPipe],
  exports: [OrderService],
})
export class OrderModule {}
