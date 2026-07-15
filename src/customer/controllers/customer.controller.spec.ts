import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.jest';

import { CustomerController } from './customer.controller';
import { CustomerService } from '../services/customer.service';
import { CreateCustomer } from '../dto/create-customer.dto';
import { UpdateCustomer } from '../dto/update-customer.dto';
import { Customer } from '../entities/customer.entity';

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
    const page = 2;
    const limit = 5;
    const customers: [Customer[], number] = [
      [{ id: 1, code: 'TEST1', companyName: 'Test Company' }],
      1,
    ];

    service.findAll.mockResolvedValue(customers);

    const result = await controller.findAll(page, limit);

    expect(result).toEqual(customers);
    expect(service.findAll).toHaveBeenCalledWith(page, limit);
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
    const changes: UpdateCustomer = { companyName: 'Updated Company' };
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
