import { setSeederFactory } from 'typeorm-extension';

import { Order } from '../../order/entities/order.entity';
import {
  alfki,
  anatr,
  anton,
  arout,
  bergs,
  blonp,
  bolid,
  bonap,
  centc,
  chops,
  commi,
  dracd,
  dumon,
  eastc,
  ernsh,
  famia,
  folko,
  frank,
  furib,
  galed,
  godos,
  grosr,
  hanar,
  hila,
  hungc,
  hungg,
  islat,
  koene,
  lamai,
  lehms,
  lilas,
  lonep,
  magaa,
  merep,
  morgk,
  oldwo,
  ottik,
  peric,
  picco,
  prini,
  quede,
  queen,
  quick,
  rattc,
  reggc,
  ricar,
  ricsu,
  romey,
  santg,
  savea,
  seves,
  simob,
  splir,
  suprd,
  thebi,
  tomsp,
  tortu,
  traih,
  vaffe,
  victe,
  vinet,
  wandk,
  warth,
  welli,
  whitc,
  wolza,
} from '../seeds/customer.seeder';
import {
  AndrewFuller,
  AnneDodsworth,
  JanetLeverling,
  LauraCallahan,
  MargaretPeacock,
  MichaelSuyama,
  NancyDavolio,
  RobertKing,
  StevenBuchanan,
} from '../seeds/employee.seeder';
import {
  federalShipping,
  speedyExpress,
  unitedPackage,
} from '../seeds/shipper.seeder';

const customers = [
  alfki,
  anatr,
  anton,
  arout,
  bergs,
  blonp,
  bolid,
  bonap,
  centc,
  chops,
  commi,
  dracd,
  dumon,
  eastc,
  ernsh,
  famia,
  folko,
  frank,
  furib,
  galed,
  godos,
  grosr,
  hanar,
  hila,
  hungc,
  hungg,
  islat,
  koene,
  lamai,
  lehms,
  lilas,
  lonep,
  magaa,
  merep,
  morgk,
  oldwo,
  ottik,
  peric,
  picco,
  prini,
  quede,
  queen,
  quick,
  rattc,
  reggc,
  ricar,
  ricsu,
  romey,
  santg,
  savea,
  seves,
  simob,
  splir,
  suprd,
  thebi,
  tomsp,
  tortu,
  traih,
  vaffe,
  victe,
  vinet,
  wandk,
  warth,
  welli,
  whitc,
  wolza,
];

const employees = [
  AndrewFuller,
  NancyDavolio,
  JanetLeverling,
  MargaretPeacock,
  StevenBuchanan,
  MichaelSuyama,
  RobertKing,
  LauraCallahan,
  AnneDodsworth,
];

const shippers = [speedyExpress, unitedPackage, federalShipping];

export const orderFactory = setSeederFactory(Order, (faker) => {
  const order = new Order();

  order.customer = faker.helpers.arrayElement(customers);
  order.employee = faker.helpers.arrayElement(employees);
  order.orderDate = faker.date.past({ years: 3 });
  order.requiredDate = faker.date.future({ years: 1 });
  order.shippedDate = faker.date.recent({ days: 30 });
  order.shipVia = faker.helpers.arrayElement(shippers);
  order.freight = faker.number.float({ min: 0, max: 999, fractionDigits: 2 });
  order.shipName = faker.company.name().substring(0, 40);
  order.shipAddress = faker.location.streetAddress().substring(0, 60);
  order.shipCity = faker.location.city().substring(0, 15);
  order.shipRegion = faker.helpers.maybe(() =>
    faker.location.state().substring(0, 15),
  );
  order.shipPostalCode = faker.location.zipCode().substring(0, 10);
  order.shipCountry = faker.location.country().substring(0, 15);

  return order;
});
