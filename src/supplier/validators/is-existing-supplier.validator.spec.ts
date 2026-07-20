import { Test } from '@nestjs/testing';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { plainToInstance } from 'class-transformer';
import { useContainer, validate } from 'class-validator';

import {
  IsExistingSupplier,
  IsExistingSupplierConstraint,
} from './is-existing-supplier.validator';
import { SupplierService } from '../services/supplier.service';

describe('IsExistingSupplier validator', () => {
  class TestDto {
    @IsExistingSupplier()
    readonly supplierId!: number;
  }

  let service: Mocked<SupplierService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: SupplierService,
          useFactory: mock,
        },
        IsExistingSupplierConstraint,
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });

    service = module.get<Mocked<SupplierService>>(SupplierService);
  });

  it('given a DTO when the supplier id exists then it should not be any errors', async () => {
    void service.exists.mockResolvedValue(true);

    const dto = plainToInstance(TestDto, { supplierId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('given a DTO when the supplier id does not exist then it should return an error', async () => {
    void service.exists.mockResolvedValue(false);

    const dto = plainToInstance(TestDto, { supplierId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchInlineSnapshot(`
      {
        "IsExistingSupplier": "Supplier with id 1 does not exist",
      }
    `);
  });
});
