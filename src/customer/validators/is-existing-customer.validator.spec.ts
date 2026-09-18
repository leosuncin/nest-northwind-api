import { Test } from '@nestjs/testing';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { plainToInstance } from 'class-transformer';
import { useContainer, validate } from 'class-validator';

import {
  IsExistingCustomer,
  IsExistingCustomerConstraint,
} from './is-existing-customer.validator.js';
import { CustomerService } from '../services/customer.service.js';

describe('IsExistingCustomer validator', () => {
  class TestDto {
    @IsExistingCustomer()
    readonly customerId!: number;
  }

  let service: Mocked<CustomerService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: CustomerService,
          useFactory: mock,
        },
        IsExistingCustomerConstraint,
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });

    service = module.get<Mocked<CustomerService>>(CustomerService);
  });

  it('given a DTO when the customer id exists then it should not be any errors', async () => {
    void service.exists.mockResolvedValue(true);

    const dto = plainToInstance(TestDto, { customerId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('given a DTO when the customer id does not exist then it should return an error', async () => {
    void service.exists.mockResolvedValue(false);

    const dto = plainToInstance(TestDto, { customerId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchInlineSnapshot(`
      {
        "IsExistingCustomer": "Customer with id equal to 1 does not exist",
      }
    `);
  });
});
