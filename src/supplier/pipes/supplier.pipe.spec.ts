import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { Supplier } from '../entities/supplier.entity';
import { SupplierService } from '../services/supplier.service';
import { SupplierPipe } from './supplier.pipe';

describe('SupplierPipe', () => {
  let pipe: SupplierPipe;
  let repository: Mocked<Repository<Supplier>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.sociable(SupplierPipe)
      .expose(SupplierService)
      .compile();

    pipe = unit;
    repository = unitRef.get(
      getRepositoryToken(Supplier) as string,
    ) as unknown as Mocked<Repository<Supplier>>;
  });

  test('given a supplier id when transform then it returns the supplier from the service', async () => {
    const id = 1;
    const supplier = { id, companyName: 'Test Supplier' } as Supplier;

    repository.findOneByOrFail.mockResolvedValue(supplier);

    const result = await pipe.transform(id);

    expect(result).toEqual(supplier);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });
});
