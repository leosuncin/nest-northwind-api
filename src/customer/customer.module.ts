import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { Customer } from './entities/customer.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), SharedModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
