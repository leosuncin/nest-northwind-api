import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { CustomerController } from './controllers/customer.controller';
import { Customer } from './entities/customer.entity';
import { CustomerService } from './services/customer.service';
import { IsExistingCustomerConstraint } from './validators/is-existing-customer.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), SharedModule],
  controllers: [CustomerController],
  providers: [CustomerService, IsExistingCustomerConstraint],
  exports: [IsExistingCustomerConstraint],
})
export class CustomerModule {}
