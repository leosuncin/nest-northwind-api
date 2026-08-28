import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module.js';
import { CustomerController } from './controllers/customer.controller.js';
import { Customer } from './entities/customer.entity.js';
import { CustomerService } from './services/customer.service.js';
import { IsExistingCustomerConstraint } from './validators/is-existing-customer.validator.js';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), SharedModule],
  controllers: [CustomerController],
  providers: [CustomerService, IsExistingCustomerConstraint],
  exports: [IsExistingCustomerConstraint],
})
export class CustomerModule {}
