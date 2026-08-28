import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateCustomer } from '../dto/create-customer.dto.js';
import { UpdateCustomer } from '../dto/update-customer.dto.js';
import { Customer } from '../entities/customer.entity.js';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  create(createCustomer: CreateCustomer) {
    const customer = this.customerRepository.create(createCustomer);

    return this.customerRepository.save(customer);
  }

  findAll(page = 1, limit = 10) {
    return this.customerRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.customerRepository.findOneByOrFail({ id });
  }

  update(customer: Customer, updateCustomer: UpdateCustomer) {
    this.customerRepository.merge(customer, updateCustomer);

    return this.customerRepository.save(customer);
  }

  remove(customer: Customer) {
    return this.customerRepository.remove(customer);
  }

  async exists(id: Customer['id']) {
    const count = await this.customerRepository.countBy({ id });

    return count > 0;
  }
}
