import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { ShipperService } from './shipper.service';
import { Shipper } from '../entities/shipper.entity';
import { CreateShipper } from '../dto/create-shipper.dto';
import { UpdateShipper } from '../dto/update-shipper.dto';

describe('ShipperService', () => {
  let service: ShipperService;
  let repository: Mocked<Repository<Shipper>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(ShipperService).compile();

    service = unit;
    repository = unitRef.get(
      getRepositoryToken(Shipper) as string,
    ) as unknown as Mocked<Repository<Shipper>>;
  });

  test('given a valid dto when create then it persists and returns the shipper', async () => {
    const createShipper: CreateShipper = {
      companyName: 'Test Shipper',
      phone: '(503) 555-9831',
    };
    const createdShipper = { id: 1, ...createShipper } as Shipper;

    repository.create.mockReturnValue(createdShipper);
    repository.save.mockResolvedValue(createdShipper);

    const shipper = await service.create(createShipper);

    expect(shipper).toEqual(createdShipper);
    expect(repository.create).toHaveBeenCalledWith(createShipper);
    expect(repository.save).toHaveBeenCalledWith(createdShipper);
  });

  test('given pagination params when findAll then it returns a paginated result', async () => {
    const page = 2;
    const limit = 5;
    const result: [Shipper[], number] = [
      [{ id: 1, companyName: 'Test Shipper' }],
      1,
    ];

    repository.findAndCount.mockResolvedValue(result);

    const shippers = await service.findAll(page, limit);

    expect(shippers).toEqual(result);
    expect(repository.findAndCount).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
  });

  test('given an id when findOne then it returns the matching shipper', async () => {
    const id = 1;
    const shipper = { id, companyName: 'Test Shipper' } as Shipper;

    repository.findOneByOrFail.mockResolvedValue(shipper);

    const found = await service.findOne(id);

    expect(found).toEqual(shipper);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });

  test('given a shipper and changes when update then it merges and persists them', async () => {
    const shipper = { id: 1, companyName: 'Test Shipper' } as Shipper;
    const changes: UpdateShipper = { companyName: 'Updated Shipper' };

    repository.merge.mockReturnValue(shipper);
    repository.save.mockResolvedValue(shipper);

    const result = await service.update(shipper, changes);

    expect(result).toEqual(shipper);
    expect(repository.merge).toHaveBeenCalledWith(shipper, changes);
    expect(repository.save).toHaveBeenCalledWith(shipper);
  });

  test('given a shipper when remove then it deletes and returns it', async () => {
    const shipper = { id: 1, companyName: 'Test Shipper' } as Shipper;

    repository.remove.mockResolvedValue(shipper);

    const result = await service.remove(shipper);

    expect(result).toEqual(shipper);
    expect(repository.remove).toHaveBeenCalledWith(shipper);
  });

  test('given the customer id when the customer exist then it returns true', async () => {
    const id = 1;

    void repository.countBy.mockResolvedValue(1);

    const result = await service.exists(1);

    expect(result).toBe(true);
    expect(repository.countBy).toHaveBeenCalledWith({ id });
  });
});
