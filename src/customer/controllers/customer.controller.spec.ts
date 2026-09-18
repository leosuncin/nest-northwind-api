import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';

import { CustomerController } from './customer.controller.js';
import { CustomerService } from '../services/customer.service.js';
import { CreateCustomer } from '../dto/create-customer.dto.js';
import { UpdateCustomer } from '../dto/update-customer.dto.js';
import { Customer } from '../entities/customer.entity.js';
import { IQuery } from '@rapiq/core';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: Mocked<CustomerService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(CustomerController).compile();

    controller = unit;
    service = unitRef.get(
      CustomerService,
    ) as unknown as Mocked<CustomerService>;
  });

  test('given a valid dto when create then it delegates to the service', async () => {
    const createCustomer: CreateCustomer = {
      code: 'TEST1',
      companyName: 'Test Company',
    };
    const createdCustomer = { id: 1, ...createCustomer } as Customer;

    service.create.mockResolvedValue(createdCustomer);

    const result = await controller.create(createCustomer);

    expect(result).toEqual(createdCustomer);
    expect(service.create).toHaveBeenCalledWith(createCustomer);
  });

  test('given a page and limit when findAll then it delegates to the service', async () => {
    const filters = {
      pagination: {
        limit: 5,
        offset: 5,
      },
    } as IQuery;
    const customers: [Customer[], number] = [
      [{ id: 1, code: 'TEST1', companyName: 'Test Company' }],
      1,
    ];

    service.findAll.mockResolvedValue(customers);

    const result = await controller.findAll(filters);

    expect(result).toEqual(customers);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  test('given an id when findOne then it delegates to the service', async () => {
    const id = 1;
    const customer = {
      id,
      code: 'TEST1',
      companyName: 'Test Company',
    } as Customer;

    service.findOne.mockResolvedValue(customer);

    const result = await controller.findOne(id);

    expect(result).toEqual(customer);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  test('given a customer and changes when update then it delegates to the service', async () => {
    const customer = {
      id: 1,
      code: 'TEST1',
      companyName: 'Test Company',
    } as Customer;
    const changes: UpdateCustomer = { id: 1, companyName: 'Updated Company' };
    const updatedCustomer = { ...customer, ...changes };

    service.update.mockResolvedValue(updatedCustomer);

    const result = await controller.update(customer, changes);

    expect(result).toEqual(updatedCustomer);
    expect(service.update).toHaveBeenCalledWith(customer, changes);
  });

  test('given a customer when remove then it delegates to the service', async () => {
    const customer = {
      id: 1,
      code: 'TEST1',
      companyName: 'Test Company',
    } as Customer;

    service.remove.mockResolvedValue(customer);

    const result = await controller.remove(customer);

    expect(result).toEqual(customer);
    expect(service.remove).toHaveBeenCalledWith(customer);
  });
});
