import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { Supplier } from '../entities/supplier.entity.js';
import { SupplierService } from '../services/supplier.service.js';
import { SupplierPipe } from './supplier.pipe.js';

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

  test('given a param type when the value is an id then it transforms it to a supplier', async () => {
    const id = 1;
    const supplier = { id, companyName: 'Test Supplier' } as Supplier;

    void repository.findOneByOrFail.mockResolvedValue(supplier);

    const result = await pipe.transform(id, { type: 'param' });

    expect(result).toEqual(supplier);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });

  test("given a body type when the value is an object with the supplier's id then it transforms it to a supplier", async () => {
    const id = 1;
    const supplier = { id, companyName: 'Test Supplier' } as Supplier;

    void repository.findOneByOrFail.mockResolvedValue(supplier);

    const result = await pipe.transform({ supplier: id }, { type: 'body' });

    expect(result).toEqual({ supplier });
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });
});
