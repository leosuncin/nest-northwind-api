import type { IQuery } from '@rapiq/core';
import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';

import { CreateShipper } from '../dto/create-shipper.dto.js';
import { UpdateShipper } from '../dto/update-shipper.dto.js';
import { Shipper } from '../entities/shipper.entity.js';
import { ShipperService } from '../services/shipper.service.js';
import { ShipperController } from './shipper.controller.js';

describe('ShipperController', () => {
  let controller: ShipperController;
  let service: Mocked<ShipperService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(ShipperController).compile();

    controller = unit;
    service = unitRef.get(ShipperService) as unknown as Mocked<ShipperService>;
  });

  test('given a valid dto when create then it delegates to the service', async () => {
    const createShipper: CreateShipper = {
      companyName: 'Test Shipper',
      phone: '(503) 555-9831',
    };
    const createdShipper = { id: 1, ...createShipper } as Shipper;

    service.create.mockResolvedValue(createdShipper);

    const result = await controller.create(createShipper);

    expect(result).toEqual(createdShipper);
    expect(service.create).toHaveBeenCalledWith(createShipper);
  });

  test('given filters when findAll then it delegates to the service', async () => {
    const filters = {
      pagination: {
        limit: 5,
        offset: 5,
      },
    } as IQuery;
    const shippers: [Shipper[], number] = [
      [{ id: 1, companyName: 'Test Shipper' }],
      1,
    ];

    service.findAll.mockResolvedValue(shippers);

    const result = await controller.findAll(filters);

    expect(result).toEqual(shippers);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  test('given an id when findOne then it delegates to the service', async () => {
    const id = 1;
    const shipper = { id, companyName: 'Test Shipper' } as Shipper;

    service.findOne.mockResolvedValue(shipper);

    const result = await controller.findOne(id);

    expect(result).toEqual(shipper);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  test('given a shipper and changes when update then it delegates to the service', async () => {
    const shipper = { id: 1, companyName: 'Test Shipper' } as Shipper;
    const changes: UpdateShipper = { companyName: 'Updated Shipper' };
    const updatedShipper = { ...shipper, ...changes };

    service.update.mockResolvedValue(updatedShipper);

    const result = await controller.update(shipper, changes);

    expect(result).toEqual(updatedShipper);
    expect(service.update).toHaveBeenCalledWith(shipper, changes);
  });

  test('given a shipper when remove then it delegates to the service', async () => {
    const shipper = { id: 1, companyName: 'Test Shipper' } as Shipper;

    service.remove.mockResolvedValue(shipper);

    const result = await controller.remove(shipper);

    expect(result).toEqual(shipper);
    expect(service.remove).toHaveBeenCalledWith(shipper);
  });
});
