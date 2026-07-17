import { setSeederFactory } from 'typeorm-extension';

import { Shipper } from '../../shipper/entities/shipper.entity';

export const shipperFactory = setSeederFactory(Shipper, (faker) => {
  const shipper = new Shipper();

  shipper.companyName = faker.company.name().substring(0, 40);
  shipper.phone = faker.phone.number().substring(0, 24);

  return shipper;
});
