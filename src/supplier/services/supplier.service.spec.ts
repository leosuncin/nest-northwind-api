import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateSupplier } from '../dto/create-supplier.dto.js';
import { UpdateSupplier } from '../dto/update-supplier.dto.js';
import { Supplier } from '../entities/supplier.entity.js';
import { SupplierService } from './supplier.service.js';

describe('SupplierService', () => {
  let service: SupplierService;
  let repository: Mocked<Repository<Supplier>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(SupplierService).compile();

    service = unit;
    repository = unitRef.get(
      getRepositoryToken(Supplier) as string,
    ) as unknown as Mocked<Repository<Supplier>>;
  });

  test('given a valid dto when create then it persists and returns the supplier in order', async () => {
    const createSupplier: CreateSupplier = {
      companyName: 'Test Supplier',
    };
    const createdSupplier = { id: 1, ...createSupplier } as Supplier;

    repository.create.mockReturnValue(createdSupplier);
    repository.save.mockResolvedValue(createdSupplier);

    const supplier = await service.create(createSupplier);

    expect(supplier).toEqual(createdSupplier);
    expect(repository.create).toHaveBeenCalledWith(createSupplier);
    expect(repository.save).toHaveBeenCalledWith(createdSupplier);
    expect(repository.create.mock.invocationCallOrder[0]).toBeLessThan(
      repository.save.mock.invocationCallOrder[0],
    );
  });

  test('given pagination params when findAll then it returns a paginated result', async () => {
    const page = 2;
    const limit = 5;
    const result: [Supplier[], number] = [
      [{ id: 1, companyName: 'Test Supplier' }],
      1,
    ];

    repository.findAndCount.mockResolvedValue(result);

    const suppliers = await service.findAll(page, limit);

    expect(suppliers).toEqual(result);
    expect(repository.findAndCount).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
  });

  test('given an id when findOne then it returns the matching supplier', async () => {
    const id = 1;
    const supplier = { id, companyName: 'Test Supplier' } as Supplier;

    repository.findOneByOrFail.mockResolvedValue(supplier);

    const found = await service.findOne(id);

    expect(found).toEqual(supplier);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });

  test('given a supplier and changes when update then it merges and persists them in order', async () => {
    const supplier = { id: 1, companyName: 'Test Supplier' } as Supplier;
    const changes: UpdateSupplier = { companyName: 'Updated Supplier' };

    repository.merge.mockReturnValue(supplier);
    repository.save.mockResolvedValue(supplier);

    const result = await service.update(supplier, changes);

    expect(result).toEqual(supplier);
    expect(repository.merge).toHaveBeenCalledWith(supplier, changes);
    expect(repository.save).toHaveBeenCalledWith(supplier);
    expect(repository.merge.mock.invocationCallOrder[0]).toBeLessThan(
      repository.save.mock.invocationCallOrder[0],
    );
  });

  test('given a supplier when remove then it deletes and returns it', async () => {
    const supplier = { id: 1, companyName: 'Test Supplier' } as Supplier;

    repository.remove.mockResolvedValue(supplier);

    const result = await service.remove(supplier);

    expect(result).toEqual(supplier);
    expect(repository.remove).toHaveBeenCalledWith(supplier);
  });
});
