import { Seeder } from 'typeorm-extension';

import { Shipper } from '../../shipper/entities/shipper.entity';
import type { DataSource, Repository } from 'typeorm';

export const speedyExpress = Object.assign<Shipper, Partial<Shipper>>(
  new Shipper(),
  {
    id: 1,
    companyName: 'Speedy Express',
    phone: '(503) 555-9831',
  },
);

export const unitedPackage = Object.assign<Shipper, Partial<Shipper>>(
  new Shipper(),
  {
    id: 2,
    companyName: 'United Package',
    phone: '(503) 555-3199',
  },
);

export const federalShipping = Object.assign<Shipper, Partial<Shipper>>(
  new Shipper(),
  {
    id: 3,
    companyName: 'Federal Shipping',
    phone: '(503) 555-9931',
  },
);

async function upsert(repository: Repository<Shipper>, shipper: Shipper) {
  const { id, ...partialEntity } = shipper;
  const result = await repository.update({ id }, partialEntity);

  if (result.affected === 0) {
    await repository.insert(shipper);
  }
}

export default class ShipperSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Shipper);

      await upsert(repository, speedyExpress);
      await upsert(repository, unitedPackage);
      await upsert(repository, federalShipping);
    });
  }
}
