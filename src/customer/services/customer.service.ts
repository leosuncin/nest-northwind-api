import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { IQuery } from '@rapiq/core';
import { TypeormAdapter } from '@rapiq/adapter-typeorm';

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

  findAll(filters: IQuery) {
    const queryBuilder = this.customerRepository.createQueryBuilder('customer');
    const adapter = new TypeormAdapter({ queryBuilder });
    adapter.execute(filters);

    return queryBuilder.getManyAndCount();
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
