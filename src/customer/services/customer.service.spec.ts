import { getRepositoryToken } from '@nestjs/typeorm';
import { defineQuery } from '@rapiq/core';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import type { Repository, SelectQueryBuilder } from 'typeorm';

import { CreateCustomer } from '../dto/create-customer.dto.js';
import { UpdateCustomer } from '../dto/update-customer.dto.js';
import { Customer } from '../entities/customer.entity.js';
import { CustomerService } from './customer.service.js';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Mocked<Repository<Customer>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(CustomerService).compile();

    service = unit;
    repository = unitRef.get(
      getRepositoryToken(Customer) as string,
    ) as unknown as Mocked<Repository<Customer>>;
  });

  test('given a valid dto when create then it persists and returns the customer', async () => {
    const createCustomer: CreateCustomer = {
      code: 'TEST1',
      companyName: 'Test Company',
    };
    const createdCustomer = { id: 1, ...createCustomer } as Customer;

    repository.create.mockReturnValue(createdCustomer);
    repository.save.mockResolvedValue(createdCustomer);

    const customer = await service.create(createCustomer);

    expect(customer).toEqual(createdCustomer);
    expect(repository.create).toHaveBeenCalledWith(createCustomer);
    expect(repository.save).toHaveBeenCalledWith(createdCustomer);
  });

  test('given pagination params when findAll then it returns a paginated result', async () => {
    const filters = defineQuery({ pagination: { limit: 5, offset: 5 } });
    const result: [Customer[], number] = [
      [{ id: 1, code: 'TEST1', companyName: 'Test Company' }],
      1,
    ];

    const queryBuilder = mock<SelectQueryBuilder<Customer>>();
    repository.createQueryBuilder.mockReturnValue(queryBuilder);
    queryBuilder.getManyAndCount.mockResolvedValue(result);

    const customers = await service.findAll(filters);

    expect(customers).toEqual(result);
    expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
  });

  test('given an id when findOne then it returns the matching customer', async () => {
    const id = 1;
    const customer = {
      id,
      code: 'TEST1',
      companyName: 'Test Company',
    } as Customer;

    repository.findOneByOrFail.mockResolvedValue(customer);

    const found = await service.findOne(id);

    expect(found).toEqual(customer);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });

  test('given a customer and changes when update then it merges and persists them', async () => {
    const customer = {
      id: 1,
      code: 'TEST1',
      companyName: 'Test Company',
    } as Customer;
    const changes: UpdateCustomer = { companyName: 'Updated Company' };

    repository.merge.mockReturnValue(customer);
    repository.save.mockResolvedValue(customer);

    const result = await service.update(customer, changes);

    expect(result).toEqual(customer);
    expect(repository.merge).toHaveBeenCalledWith(customer, changes);
    expect(repository.save).toHaveBeenCalledWith(customer);
  });

  test('given a customer when remove then it deletes and returns it', async () => {
    const customer = {
      id: 1,
      code: 'TEST1',
      companyName: 'Test Company',
    } as Customer;

    repository.remove.mockResolvedValue(customer);

    const result = await service.remove(customer);

    expect(result).toEqual(customer);
    expect(repository.remove).toHaveBeenCalledWith(customer);
  });

  test('given the customer id when the customer exist then it returns true', async () => {
    const id = 1;

    void repository.countBy.mockResolvedValue(1);

    const result = await service.exists(1);

    expect(result).toBe(true);
    expect(repository.countBy).toHaveBeenCalledWith({ id });
  });
});
