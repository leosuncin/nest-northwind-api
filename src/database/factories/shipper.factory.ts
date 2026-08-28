import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { Shipper } from '../../shipper/entities/shipper.entity.js';

export const shipperFactory = setSeederFactory(Shipper, () => {
  const shipper = new Shipper();

  shipper.companyName = faker.company.name().substring(0, 40);
  shipper.phone = faker.phone.number().substring(0, 24);

  return shipper;
});
