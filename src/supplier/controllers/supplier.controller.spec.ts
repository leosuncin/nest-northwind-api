import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';

import { SupplierController } from './supplier.controller';
import { CreateSupplier } from '../dto/create-supplier.dto';
import { UpdateSupplier } from '../dto/update-supplier.dto';
import { Supplier } from '../entities/supplier.entity';
import { SupplierService } from '../services/supplier.service';

describe('SupplierController', () => {
  let controller: SupplierController;
  let service: Mocked<SupplierService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(SupplierController).compile();

    controller = unit;
    service = unitRef.get(
      SupplierService,
    ) as unknown as Mocked<SupplierService>;
  });

  test('given a valid dto when create then it delegates to the service', async () => {
    const createSupplier: CreateSupplier = { companyName: 'Test Supplier' };
    const createdSupplier = { id: 1, ...createSupplier } as Supplier;

    service.create.mockResolvedValue(createdSupplier);

    const result = await controller.create(createSupplier);

    expect(result).toEqual(createdSupplier);
    expect(service.create).toHaveBeenCalledWith(createSupplier);
  });

  test('given a page and limit when findAll then it delegates to the service', async () => {
    const page = 2;
    const limit = 5;
    const suppliers: [Supplier[], number] = [
      [{ id: 1, companyName: 'Test Supplier' }],
      1,
    ];

    service.findAll.mockResolvedValue(suppliers);

    const result = await controller.findAll(page, limit);

    expect(result).toEqual(suppliers);
    expect(service.findAll).toHaveBeenCalledWith(page, limit);
  });

  test('given an id when findOne then it delegates to the service', async () => {
    const id = 1;
    const supplier = { id, companyName: 'Test Supplier' } as Supplier;

    service.findOne.mockResolvedValue(supplier);

    const result = await controller.findOne(id);

    expect(result).toEqual(supplier);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  test('given a supplier and changes when update then it delegates to the service', async () => {
    const supplier = { id: 1, companyName: 'Test Supplier' } as Supplier;
    const changes: UpdateSupplier = { companyName: 'Updated Supplier' };
    const updatedSupplier = { ...supplier, ...changes };

    service.update.mockResolvedValue(updatedSupplier);

    const result = await controller.update(supplier, changes);

    expect(result).toEqual(updatedSupplier);
    expect(service.update).toHaveBeenCalledWith(supplier, changes);
  });

  test('given a supplier when remove then it delegates to the service', async () => {
    const supplier = { id: 1, companyName: 'Test Supplier' } as Supplier;

    service.remove.mockResolvedValue(supplier);

    const result = await controller.remove(supplier);

    expect(result).toEqual(supplier);
    expect(service.remove).toHaveBeenCalledWith(supplier);
  });
});
