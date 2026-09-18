import { Test } from '@nestjs/testing';
import { PartialType } from '@nestjs/mapped-types';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { plainToInstance } from 'class-transformer';
import { Allow, IsDefined, useContainer, validate } from 'class-validator';

import { CustomerService } from '../services/customer.service.js';
import {
  ExistingCustomer,
  IsExistingCustomerConstraint,
} from './is-existing-customer.validator.js';

describe('IsExistingCustomer validator', () => {
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

  describe('Foreign key', () => {
    class RelationDto {
      @ExistingCustomer()
      readonly customerId!: number;
    }

    it('given a DTO when the customer id exists then it should not be any errors', async () => {
      void service.exists.mockResolvedValue(true);

      const dto = plainToInstance(RelationDto, { customerId: 1 });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(service.exists).toHaveBeenCalledWith({ id: 1 });
    });

    it('given a DTO when the customer id does not exist then it should return an error', async () => {
      void service.exists.mockResolvedValue(false);

      const dto = plainToInstance(RelationDto, { customerId: 1 });
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toMatchInlineSnapshot(`
        {
          "ExistingCustomer": "Customer with id equal to 1 does not exist",
        }
      `);
      expect(service.exists).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('Create', () => {
    class CreateDto {
      @IsDefined()
      @ExistingCustomer()
      readonly code!: string;
    }

    it('given a DTO when the customer code does not exist then it should not be any errors', async () => {
      void service.exists.mockResolvedValue(false);

      const dto = plainToInstance(CreateDto, { code: 'ACME' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(service.exists).toHaveBeenCalledWith({ code: 'ACME' });
    });
  });

  describe('Update', () => {
    class CreateDto {
      @IsDefined()
      @ExistingCustomer()
      readonly code!: string;
    }

    class UpdateDto extends PartialType(CreateDto) {
      @Allow()
      readonly id!: number;
    }

    it('given a DTO when there is no customer with the same code then it should not be any errors', async () => {
      void service.exists.mockResolvedValue(false);

      const dto = plainToInstance(UpdateDto, { code: 'ACME', id: 2 });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(service.exists).toHaveBeenCalledWith({ code: 'ACME', id: 2 });
    });

    it('given a DTO when there is a customer with the same code then it should return an error', async () => {
      void service.exists.mockResolvedValue(true);

      const dto = plainToInstance(UpdateDto, { code: 'ALFKI', id: 2 });
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toMatchInlineSnapshot(`
        {
          "ExistingCustomer": "Customer with code equal to ALFKI exists",
        }
      `);
      expect(service.exists).toHaveBeenCalledWith({ code: 'ALFKI', id: 2 });
    });
  });
});
