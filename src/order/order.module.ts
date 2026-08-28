import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module.js';
import { CustomerModule } from '../customer/customer.module.js';
import { EmployeeModule } from '../employee/employee.module.js';
import { ShipperModule } from '../shipper/shipper.module.js';
import { ProductModule } from '../product/product.module.js';
import { Order } from './entities/order.entity.js';
import { OrderDetail } from './entities/order-detail.entity.js';
import { OrderService } from './services/order.service.js';
import { OrderDetailService } from './services/order-detail.service.js';
import { OrderPipe } from './pipes/order.pipe.js';
import { OrderController } from './controllers/order.controller.js';
import { OrderDetailController } from './controllers/order-detail.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    SharedModule,
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
