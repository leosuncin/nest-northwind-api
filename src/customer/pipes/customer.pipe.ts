import { Injectable, PipeTransform } from '@nestjs/common';

import { Customer } from '../entities/customer.entity';
import { CustomerService } from '../services/customer.service';

@Injectable()
export class CustomerPipe implements PipeTransform {
  constructor(private readonly customerService: CustomerService) {}

  transform(value: Customer['id']) {
    return this.customerService.findOne(value);
  }
}
