import { getRepositoryToken } from '@nestjs/typeorm';
import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import type { Repository } from 'typeorm';

import { Customer } from '../entities/customer.entity';
import { CustomerService } from '../services/customer.service';
import { CustomerPipe } from './customer.pipe';

describe('CustomerPipe', () => {
  let pipe: CustomerPipe;
  let repository: Mocked<Repository<Customer>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.sociable(CustomerPipe)
      .expose(CustomerService)
      .compile();

    pipe = unit;
    repository = unitRef.get(
      getRepositoryToken(Customer) as string,
    ) as unknown as Mocked<Repository<Customer>>;
  });

  test('given a customer id when transform then it returns the customer from the service', async () => {
    const id = 1;
    const customer = { id } as Customer;

    repository.findOneByOrFail.mockResolvedValue(customer);

    const result = await pipe.transform(id);

    expect(result).toEqual(customer);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });
});
