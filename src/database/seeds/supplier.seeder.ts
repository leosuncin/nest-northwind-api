import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Supplier } from '../../supplier/entities/supplier.entity';

export const exoticLiquids = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 1,
    companyName: 'Exotic Liquids',
    contactName: 'Charlotte Cooper',
    contactTitle: 'Purchasing Manager',
    address: '49 Gilbert St.',
    city: 'London',
    postalCode: 'EC1 4SD',
    country: 'UK',
    phone: '(171) 555-2222',
  },
);

export const newOrleansCajunDelights = Object.assign<
  Supplier,
  Partial<Supplier>
>(new Supplier(), {
  id: 2,
  companyName: 'New Orleans Cajun Delights',
  contactName: 'Shelley Burke',
  contactTitle: 'Order Administrator',
  address: 'P.O. Box 78934',
  city: 'New Orleans',
  region: 'LA',
  postalCode: '70117',
  country: 'USA',
  phone: '(100) 555-4822',
  homePage: '#CAJUN.HTM#',
});

export const grandmaKellysHomestead = Object.assign<
  Supplier,
  Partial<Supplier>
>(new Supplier(), {
  id: 3,
  companyName: "Grandma Kelly's Homestead",
  contactName: 'Regina Murphy',
  contactTitle: 'Sales Representative',
  address: '707 Oxford Rd.',
  city: 'Ann Arbor',
  region: 'MI',
  postalCode: '48104',
  country: 'USA',
  phone: '(313) 555-5735',
  fax: '(313) 555-3349',
});

export const tokyoTraders = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 4,
    companyName: 'Tokyo Traders',
    contactName: 'Yoshi Nagase',
    contactTitle: 'Marketing Manager',
    address: '9-8 Sekimai Musashino-shi',
    city: 'Tokyo',
    postalCode: '100',
    country: 'Japan',
    phone: '(03) 3555-5011',
  },
);

export const cooperativaDeQuesosLasCabras = Object.assign<
  Supplier,
  Partial<Supplier>
>(new Supplier(), {
  id: 5,
  companyName: "Cooperativa de Quesos 'Las Cabras'",
  contactName: 'Antonio del Valle Saavedra',
  contactTitle: 'Export Administrator',
  address: 'Calle del Rosal 4',
  city: 'Oviedo',
  region: 'Asturias',
  postalCode: '33007',
  country: 'Spain',
  phone: '(98) 598 76 54',
});

export const mayumis = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 6,
    companyName: "Mayumi's",
    contactName: 'Mayumi Ohno',
    contactTitle: 'Marketing Representative',
    address: '92 Setsuko Chuo-ku',
    city: 'Osaka',
    postalCode: '545',
    country: 'Japan',
    phone: '(06) 431-7877',
    homePage:
      "Mayumi's (on the World Wide Web)#http://www.microsoft.com/accessdev/sampleapps/mayumi.htm#",
  },
);

export const pavlovaLtd = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 7,
    companyName: 'Pavlova, Ltd.',
    contactName: 'Ian Devling',
    contactTitle: 'Marketing Manager',
    address: '74 Rose St. Moonie Ponds',
    city: 'Melbourne',
    region: 'Victoria',
    postalCode: '3058',
    country: 'Australia',
    phone: '(03) 444-2343',
    fax: '(03) 444-6588',
  },
);

export const specialtyBiscuitsLtd = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 8,
    companyName: 'Specialty Biscuits, Ltd.',
    contactName: 'Peter Wilson',
    contactTitle: 'Sales Representative',
    address: "29 King's Way",
    city: 'Manchester',
    postalCode: 'M14 GSD',
    country: 'UK',
    phone: '(161) 555-4448',
  },
);

export const pbKnackebrodAB = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 9,
    companyName: 'PB Knäckebröd AB',
    contactName: 'Lars Peterson',
    contactTitle: 'Sales Agent',
    address: 'Kaloadagatan 13',
    city: 'Göteborg',
    postalCode: 'S-345 67',
    country: 'Sweden',
    phone: '031-987 65 43',
    fax: '031-987 65 91',
  },
);

export const refrescosAmericanasLTDA = Object.assign<
  Supplier,
  Partial<Supplier>
>(new Supplier(), {
  id: 10,
  companyName: 'Refrescos Americanas LTDA',
  contactName: 'Carlos Diaz',
  contactTitle: 'Marketing Manager',
  address: 'Av. das Americanas 12.890',
  city: 'Sao Paulo',
  postalCode: '5442',
  country: 'Brazil',
  phone: '(11) 555 4640',
});

export const heliSusswarenGmbHCoKG = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 11,
    companyName: 'Heli Süßwaren GmbH & Co. KG',
    contactName: 'Petra Winkler',
    contactTitle: 'Sales Manager',
    address: 'Tiergartenstraße 5',
    city: 'Berlin',
    postalCode: '10785',
    country: 'Germany',
    phone: '(010) 9984510',
  },
);

export const plutzerLebensmittelgrossmarkteAG = Object.assign<
  Supplier,
  Partial<Supplier>
>(new Supplier(), {
  id: 12,
  companyName: 'Plutzer Lebensmittelgroßmärkte AG',
  contactName: 'Martin Bein',
  contactTitle: 'International Marketing Mgr.',
  address: 'Bogenallee 51',
  city: 'Frankfurt',
  postalCode: '60439',
  country: 'Germany',
  phone: '(069) 992755',
  homePage:
    'Plutzer (on the World Wide Web)#http://www.microsoft.com/accessdev/sampleapps/plutzer.htm#',
});

export const nordOstFischHandelsgesellschaftMbH = Object.assign<
  Supplier,
  Partial<Supplier>
>(new Supplier(), {
  id: 13,
  companyName: 'Nord-Ost-Fisch Handelsgesellschaft mbH',
  contactName: 'Sven Petersen',
  contactTitle: 'Coordinator Foreign Markets',
  address: 'Frahmredder 112a',
  city: 'Cuxhaven',
  postalCode: '27478',
  country: 'Germany',
  phone: '(04721) 8713',
  fax: '(04721) 8714',
});

export const formaggiFortiniSRL = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 14,
    companyName: 'Formaggi Fortini s.r.l.',
    contactName: 'Elio Rossi',
    contactTitle: 'Sales Representative',
    address: 'Viale Dante, 75',
    city: 'Ravenna',
    postalCode: '48100',
    country: 'Italy',
    phone: '(0544) 60323',
    fax: '(0544) 60603',
    homePage: '#FORMAGGI.HTM#',
  },
);

export const norskeMeierier = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 15,
    companyName: 'Norske Meierier',
    contactName: 'Beate Vileid',
    contactTitle: 'Marketing Manager',
    address: 'Hatlevegen 5',
    city: 'Sandvika',
    postalCode: '1320',
    country: 'Norway',
    phone: '(0)2-953010',
  },
);

export const bigfootBreweries = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 16,
    companyName: 'Bigfoot Breweries',
    contactName: 'Cheryl Saylor',
    contactTitle: 'regional Account Rep.',
    address: '3400 - 8th Avenue Suite 210',
    city: 'Bend',
    region: 'OR',
    postalCode: '97101',
    country: 'USA',
    phone: '(503) 555-9931',
  },
);

export const svenskSjofoodaAB = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 17,
    companyName: 'Svensk Sjöföda AB',
    contactName: 'Michael Björn',
    contactTitle: 'Sales Representative',
    address: 'Brovallavägen 231',
    city: 'Stockholm',
    postalCode: 'S-123 45',
    country: 'Sweden',
    phone: '08-123 45 67',
  },
);

export const auxJoyeuxEcclesiastiques = Object.assign<
  Supplier,
  Partial<Supplier>
>(new Supplier(), {
  id: 18,
  companyName: 'Aux joyeux ecclésiastiques',
  contactName: 'Guylène Nodier',
  contactTitle: 'Sales Manager',
  address: '203, Rue des Francs-Bourgeois',
  city: 'Paris',
  postalCode: '75004',
  country: 'France',
  phone: '(1) 03.83.00.68',
  fax: '(1) 03.83.00.62',
});

export const newEnglandSeafoodCannery = Object.assign<
  Supplier,
  Partial<Supplier>
>(new Supplier(), {
  id: 19,
  companyName: 'New England Seafood Cannery',
  contactName: 'Robb Merchant',
  contactTitle: 'Wholesale Account Agent',
  address: 'Order Processing Dept. 2100 Paul Revere Blvd.',
  city: 'Boston',
  region: 'MA',
  postalCode: '02134',
  country: 'USA',
  phone: '(617) 555-3267',
  fax: '(617) 555-3389',
});

export const lekaTrading = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 20,
    companyName: 'Leka Trading',
    contactName: 'Chandra Leka',
    contactTitle: 'Owner',
    address: '471 Serangoon Loop, Suite #402',
    city: 'Singapore',
    postalCode: '0512',
    country: 'Singapore',
    phone: '555-8787',
  },
);

export const lyngbysild = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 21,
    companyName: 'Lyngbysild',
    contactName: 'Niels Petersen',
    contactTitle: 'Sales Manager',
    address: 'Lyngbysild Fiskebakken 10',
    city: 'Lyngby',
    postalCode: '2800',
    country: 'Denmark',
    phone: '43844108',
    fax: '43844115',
  },
);

export const zaanseSnoepfabriek = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 22,
    companyName: 'Zaanse Snoepfabriek',
    contactName: 'Dirk Luchte',
    contactTitle: 'Accounting Manager',
    address: 'Verkoop Rijnweg 22',
    city: 'Zaandam',
    postalCode: '9999 ZZ',
    country: 'Netherlands',
    phone: '(12345) 1212',
    fax: '(12345) 1210',
  },
);

export const karkkiOy = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 23,
    companyName: 'Karkki Oy',
    contactName: 'Anne Heikkonen',
    contactTitle: 'Product Manager',
    address: 'Valtakatu 12',
    city: 'Lappeenranta',
    postalCode: '53120',
    country: 'Finland',
    phone: '(953) 10956',
  },
);

export const gdayMate = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 24,
    companyName: "G'day, Mate",
    contactName: 'Wendy Mackenzie',
    contactTitle: 'Sales Representative',
    address: "170 Prince Edward Parade Hunter's Hill",
    city: 'Sydney',
    region: 'NSW',
    postalCode: '2042',
    country: 'Australia',
    phone: '(02) 555-5914',
    fax: '(02) 555-4873',
    homePage:
      "G'day Mate (on the World Wide Web)#http://www.microsoft.com/accessdev/sampleapps/gdaymate.htm#",
  },
);

export const maMaison = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 25,
    companyName: 'Ma Maison',
    contactName: 'Jean-Guy Lauzon',
    contactTitle: 'Marketing Manager',
    address: '2960 Rue St. Laurent',
    city: 'Montréal',
    region: 'Québec',
    postalCode: 'H1J 1C3',
    country: 'Canada',
    phone: '(514) 555-9022',
  },
);

export const pastaButtiniSRL = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 26,
    companyName: 'Pasta Buttini s.r.l.',
    contactName: 'Giovanni Giudici',
    contactTitle: 'Order Administrator',
    address: 'Via dei Gelsomini, 153',
    city: 'Salerno',
    postalCode: '84100',
    country: 'Italy',
    phone: '(089) 6547665',
    fax: '(089) 6547667',
  },
);

export const escargotsNouveaux = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 27,
    companyName: 'Escargots Nouveaux',
    contactName: 'Marie Delamare',
    contactTitle: 'Sales Manager',
    address: '22, rue H. Voiron',
    city: 'Montceau',
    postalCode: '71300',
    country: 'France',
    phone: '85.57.00.07',
  },
);

export const gaiPaturage = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 28,
    companyName: 'Gai pâturage',
    contactName: 'Eliane Noz',
    contactTitle: 'Sales Representative',
    address: 'Bat. B 3, rue des Alpes',
    city: 'Annecy',
    postalCode: '74000',
    country: 'France',
    phone: '38.76.98.06',
    fax: '38.76.98.58',
  },
);

export const foretsDerables = Object.assign<Supplier, Partial<Supplier>>(
  new Supplier(),
  {
    id: 29,
    companyName: "Forêts d'érables",
    contactName: 'Chantal Goulet',
    contactTitle: 'Accounting Manager',
    address: '148 rue Chasseur',
    city: 'Ste-Hyacinthe',
    region: 'Québec',
    postalCode: 'J2S 7S8',
    country: 'Canada',
    phone: '(514) 555-2955',
    fax: '(514) 555-2921',
  },
);

const supplierJsonFixtures = JSON.stringify(
  [
    exoticLiquids,
    newOrleansCajunDelights,
    grandmaKellysHomestead,
    tokyoTraders,
    cooperativaDeQuesosLasCabras,
    mayumis,
    pavlovaLtd,
    specialtyBiscuitsLtd,
    pbKnackebrodAB,
    refrescosAmericanasLTDA,
    heliSusswarenGmbHCoKG,
    plutzerLebensmittelgrossmarkteAG,
    nordOstFischHandelsgesellschaftMbH,
    formaggiFortiniSRL,
    norskeMeierier,
    bigfootBreweries,
    svenskSjofoodaAB,
    auxJoyeuxEcclesiastiques,
    newEnglandSeafoodCannery,
    lekaTrading,
    lyngbysild,
    zaanseSnoepfabriek,
    karkkiOy,
    gdayMate,
    maMaison,
    pastaButtiniSRL,
    escargotsNouveaux,
    gaiPaturage,
    foretsDerables,
  ],
  (_key, value) => {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value as unknown;
  },
);

export default class SupplierSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE supplier NOCHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT supplier ON;

      MERGE INTO supplier AS target
      USING OPENJSON(${supplierJsonFixtures}) WITH (
        id bigint,
        companyName varchar(40),
        contactName varchar(30),
        contactTitle varchar(30),
        address varchar(60),
        city varchar(15),
        region varchar(15),
        postalCode varchar(10),
        country varchar(15),
        phone varchar(24),
        fax varchar(24),
        homePage varchar(255)
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET
          companyName = source.companyName,
          contactName = source.contactName,
          contactTitle = source.contactTitle,
          address = source.address,
          city = source.city,
          region = source.region,
          postalCode = source.postalCode,
          country = source.country,
          phone = source.phone,
          fax = source.fax,
          homePage = source.homePage
      WHEN NOT MATCHED THEN
        INSERT (id, companyName, contactName, contactTitle, address, city, region, postalCode, country, phone, fax, homePage)
        VALUES (source.id, source.companyName, source.contactName, source.contactTitle, source.address, source.city, source.region, source.postalCode, source.country, source.phone, source.fax, source.homePage);

      ALTER TABLE supplier CHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT supplier OFF`;
    });
  }
}
