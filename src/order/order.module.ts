import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { CustomerModule } from '../customer/customer.module';
import { EmployeeModule } from '../employee/employee.module';
import { ShipperModule } from '../shipper/shipper.module';
import { ProductModule } from '../product/product.module';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderService } from './services/order.service';
import { OrderDetailService } from './services/order-detail.service';
import { OrderPipe } from './pipes/order.pipe';
import { OrderController } from './controllers/order.controller';
import { OrderDetailController } from './controllers/order-detail.controller';

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
