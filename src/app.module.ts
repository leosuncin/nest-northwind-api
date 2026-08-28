import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import typeormOptions from './config/typeorm.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EmployeeModule } from './employee/employee.module.js';
import { SharedModule } from './shared/shared.module.js';
import { CategoryModule } from './category/category.module.js';
import { CustomerModule } from './customer/customer.module.js';
import { SupplierModule } from './supplier/supplier.module.js';
import { ShipperModule } from './shipper/shipper.module.js';
import { ProductModule } from './product/product.module.js';
import { OrderModule } from './order/order.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    TypeOrmModule.forRootAsync(typeormOptions.asProvider()),
    EmployeeModule,
    SharedModule,
    CategoryModule,
    CustomerModule,
    SupplierModule,
    ShipperModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
