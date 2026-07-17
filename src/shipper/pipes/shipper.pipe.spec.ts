import { getRepositoryToken } from '@nestjs/typeorm';
import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import type { Repository } from 'typeorm';

import { Shipper } from '../entities/shipper.entity';
import { ShipperService } from '../services/shipper.service';
import { ShipperPipe } from './shipper.pipe';

describe('ShipperPipe', () => {
  let pipe: ShipperPipe;
  let repository: Mocked<Repository<Shipper>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.sociable(ShipperPipe)
      .expose(ShipperService)
      .compile();

    pipe = unit;
    repository = unitRef.get(
      getRepositoryToken(Shipper) as string,
    ) as unknown as Mocked<Repository<Shipper>>;
  });

  test('given a shipper id when transform then it returns the shipper from the service', async () => {
    const id = 1;
    const shipper = { id } as Shipper;

    repository.findOneByOrFail.mockResolvedValue(shipper);

    const result = await pipe.transform(id);

    expect(result).toEqual(shipper);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });
});
