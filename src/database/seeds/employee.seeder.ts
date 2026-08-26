import { Seeder } from 'typeorm-extension';

import { Employee } from '../../employee/entities/employee.entity';
import type { DataSource } from 'typeorm';

export const AndrewFuller = Object.assign<Employee, Partial<Employee>>(
  new Employee(),
  {
    id: 2,
    lastName: 'Fuller',
    firstName: 'Andrew',
    title: 'Vice President, Sales',
    titleOfCourtesy: 'Dr.',
    birthDate: new Date('1952-02-19'),
    hireDate: new Date('1992-08-14'),
    address: '908 W. Capital Way',
    city: 'Tacoma',
    region: 'WA',
    postalCode: '98401',
    country: 'USA',
    homePhone: '(206) 555-9482',
    extension: '3457',
    notes:
      'Andrew received his BTS commercial in 1974 and a Ph.D. in international marketing from the University of Dallas in 1981.  He is fluent in French and Italian and reads German.  He joined the company as a sales representative, was promoted to sales manager in January 1992 and to vice president of sales in March 1993.  Andrew is a member of the Sales Management Roundtable, the Seattle Chamber of Commerce, and the Pacific Rim Importers Association.',
    photo: 'http://accweb/emmployees/fuller.bmp',
  },
);

export const NancyDavolio = Object.assign<Employee, Partial<Employee>>(
  new Employee(),
  {
    id: 1,
    lastName: 'Davolio',
    firstName: 'Nancy',
    title: 'Sales Representative',
    titleOfCourtesy: 'Ms.',
    birthDate: new Date('1948-12-08'),
    hireDate: new Date('1992-05-01'),
    address: '507 - 20th Ave. E.Apt. 2A',
    city: 'Seattle',
    region: 'WA',
    postalCode: '98122',
    country: 'USA',
    homePhone: '(206) 555-9857',
    extension: '5467',
    notes:
      'Education includes a BA in psychology from Colorado State University in 1970.  She also completed «The Art of the Cold Call.»  Nancy is a member of Toastmasters International.',
    reportsTo: AndrewFuller,
    photo: 'http://accweb/emmployees/davolio.bmp',
  },
);

export const JanetLeverling = Object.assign<Employee, Partial<Employee>>(
  new Employee(),
  {
    id: 3,
    lastName: 'Leverling',
    firstName: 'Janet',
    title: 'Sales Representative',
    titleOfCourtesy: 'Ms.',
    birthDate: new Date('1963-08-30'),
    hireDate: new Date('1992-04-01'),
    address: '722 Moss Bay Blvd.',
    city: 'Kirkland',
    region: 'WA',
    postalCode: '98033',
    country: 'USA',
    homePhone: '(206) 555-3412',
    extension: '3355',
    notes:
      'Janet has a BS degree in chemistry from Boston College (1984).  She has also completed a certificate program in food retailing management.  Janet was hired as a sales associate in 1991 and promoted to sales representative in February 1992.',
    reportsTo: AndrewFuller,
    photo: 'http://accweb/emmployees/leverling.bmp',
  },
);

export const MargaretPeacock = Object.assign<Employee, Partial<Employee>>(
  new Employee(),
  {
    id: 4,
    lastName: 'Peacock',
    firstName: 'Margaret',
    title: 'Sales Representative',
    titleOfCourtesy: 'Mrs.',
    birthDate: new Date('1937-09-19'),
    hireDate: new Date('1993-05-03'),
    address: '4110 Old Redmond Rd.',
    city: 'Redmond',
    region: 'WA',
    postalCode: '98052',
    country: 'USA',
    homePhone: '(206) 555-8122',
    extension: '5176',
    notes:
      'Margaret holds a BA in English literature from Concordia College (1958) and an MA from the American Institute of Culinary Arts (1966).  She was assigned to the London office temporarily from July through November 1992.',
    reportsTo: AndrewFuller,
    photo: 'http://accweb/emmployees/peacock.bmp',
  },
);

export const StevenBuchanan = Object.assign<Employee, Partial<Employee>>(
  new Employee(),
  {
    id: 5,
    lastName: 'Buchanan',
    firstName: 'Steven',
    title: 'Sales Manager',
    titleOfCourtesy: 'Mr.',
    birthDate: new Date('1955-03-04'),
    hireDate: new Date('1993-10-17'),
    address: '14 Garrett Hill',
    city: 'London',
    region: 'NULL',
    postalCode: 'SW1 8JR',
    country: 'UK',
    homePhone: '(71) 555-4848',
    extension: '3453',
    notes:
      'Steven Buchanan graduated from St. Andrews University, Scotland, with a BSC degree in 1976.  Upon joining the company as a sales representative in 1992, he spent 6 months in an orientation program at the Seattle office and then returned to his permanent post in London.  He was promoted to sales manager in March 1993.  Mr. Buchanan has completed the courses «Successful Telemarketing» and «International Sales Management.»  He is fluent in French.',
    reportsTo: AndrewFuller,
    photo: 'http://accweb/emmployees/buchanan.bmp',
  },
);

export const MichaelSuyama = Object.assign<Employee, Partial<Employee>>(
  new Employee(),
  {
    id: 6,
    lastName: 'Suyama',
    firstName: 'Michael',
    title: 'Sales Representative',
    titleOfCourtesy: 'Mr.',
    birthDate: new Date('1963-07-02'),
    hireDate: new Date('1993-10-17'),
    address: 'Coventry House Miner Rd.',
    city: 'London',
    region: 'NULL',
    postalCode: 'EC2 7JR',
    country: 'UK',
    homePhone: '(71) 555-7773',
    extension: '428',
    notes:
      'Michael is a graduate of Sussex University (MA, economics, 1983) and the University of California at Los Angeles (MBA, marketing, 1986).  He has also taken the courses «Multi-Cultural Selling» and «Time Management for the Sales Professional.»  He is fluent in Japanese and can read and write French, Portuguese, and Spanish.',
    reportsTo: StevenBuchanan,
    photo: 'http://accweb/emmployees/davolio.bmp',
  },
);

export const RobertKing = Object.assign<Employee, Partial<Employee>>(
  new Employee(),
  {
    id: 7,
    lastName: 'King',
    firstName: 'Robert',
    title: 'Sales Representative',
    titleOfCourtesy: 'Mr.',
    birthDate: new Date('1960-05-29'),
    hireDate: new Date('1994-01-02'),
    address: 'Edgeham Hollow Winchester Way',
    city: 'London',
    region: 'NULL',
    postalCode: 'RG1 9SP',
    country: 'UK',
    homePhone: '(71) 555-5598',
    extension: '465',
    notes:
      'Robert King served in the Peace Corps and traveled extensively before completing his degree in English at the University of Michigan in 1992, the year he joined the company.  After completing a course entitled «Selling in Europe,» he was transferred to the London office in March 1993.',
    reportsTo: StevenBuchanan,
    photo: 'http://accweb/emmployees/davolio.bmp',
  },
);

export const LauraCallahan = Object.assign<Employee, Partial<Employee>>(
  new Employee(),
  {
    id: 8,
    lastName: 'Callahan',
    firstName: 'Laura',
    title: 'Inside Sales Coordinator',
    titleOfCourtesy: 'Ms.',
    birthDate: new Date('1958-01-09'),
    hireDate: new Date('1994-03-05'),
    address: '4726 - 11th Ave. N.E.',
    city: 'Seattle',
    region: 'WA',
    postalCode: '98105',
    country: 'USA',
    homePhone: '(206) 555-1189',
    extension: '2344',
    notes:
      'Laura received a BA in psychology from the University of Washington.  She has also completed a course in business French.  She reads and writes French.',
    reportsTo: AndrewFuller,
    photo: 'http://accweb/emmployees/davolio.bmp',
  },
);

export const AnneDodsworth = Object.assign<Employee, Partial<Employee>>(
  new Employee(),
  {
    id: 9,
    lastName: 'Dodsworth',
    firstName: 'Anne',
    title: 'Sales Representative',
    titleOfCourtesy: 'Ms.',
    birthDate: new Date('1966-01-27'),
    hireDate: new Date('1994-11-15'),
    address: '7 Houndstooth Rd.',
    city: 'London',
    postalCode: 'WG2 7LT',
    country: 'UK',
    homePhone: '(71) 555-4444',
    extension: '452',
    notes:
      'Anne has a BA degree in English from St. Lawrence College.  She is fluent in French and German.',
    reportsTo: StevenBuchanan,
    photo: 'http://accweb/emmployees/davolio.bmp',
  },
);

const employeeJsonFixtures = JSON.stringify(
  [
    {
      ...AndrewFuller,
      reportsToId: null,
      birthDate: AndrewFuller.birthDate?.toISOString().split('T')[0],
      hireDate: AndrewFuller.hireDate?.toISOString().split('T')[0],
    },
    {
      ...NancyDavolio,
      reportsToId: (NancyDavolio.reportsTo as Employee).id,
      birthDate: NancyDavolio.birthDate?.toISOString().split('T')[0],
      hireDate: NancyDavolio.hireDate?.toISOString().split('T')[0],
    },
    {
      ...JanetLeverling,
      reportsToId: (JanetLeverling.reportsTo as Employee).id,
      birthDate: JanetLeverling.birthDate?.toISOString().split('T')[0],
      hireDate: JanetLeverling.hireDate?.toISOString().split('T')[0],
    },
    {
      ...MargaretPeacock,
      reportsToId: (MargaretPeacock.reportsTo as Employee).id,
      birthDate: MargaretPeacock.birthDate?.toISOString().split('T')[0],
      hireDate: MargaretPeacock.hireDate?.toISOString().split('T')[0],
    },
    {
      ...StevenBuchanan,
      reportsToId: (StevenBuchanan.reportsTo as Employee).id,
      birthDate: StevenBuchanan.birthDate?.toISOString().split('T')[0],
      hireDate: StevenBuchanan.hireDate?.toISOString().split('T')[0],
    },
    {
      ...MichaelSuyama,
      reportsToId: (MichaelSuyama.reportsTo as Employee).id,
      birthDate: MichaelSuyama.birthDate?.toISOString().split('T')[0],
      hireDate: MichaelSuyama.hireDate?.toISOString().split('T')[0],
    },
    {
      ...RobertKing,
      reportsToId: (RobertKing.reportsTo as Employee).id,
      birthDate: RobertKing.birthDate?.toISOString().split('T')[0],
      hireDate: RobertKing.hireDate?.toISOString().split('T')[0],
    },
    {
      ...LauraCallahan,
      reportsToId: (LauraCallahan.reportsTo as Employee).id,
      birthDate: LauraCallahan.birthDate?.toISOString().split('T')[0],
      hireDate: LauraCallahan.hireDate?.toISOString().split('T')[0],
    },
    {
      ...AnneDodsworth,
      reportsToId: (AnneDodsworth.reportsTo as Employee).id,
      birthDate: AnneDodsworth.birthDate?.toISOString().split('T')[0],
      hireDate: AnneDodsworth.hireDate?.toISOString().split('T')[0],
    },
  ],
  (_key, value) => {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value as unknown;
  },
);

export default class EmployeeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE employee NOCHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT employee ON;

      MERGE INTO employee AS target
      USING OPENJSON(${employeeJsonFixtures}) WITH (
        id bigint,
        firstName varchar(10),
        lastName varchar(20),
        title varchar(30),
        titleOfCourtesy varchar(25),
        birthDate date,
        hireDate date,
        address varchar(60),
        city varchar(15),
        region varchar(15),
        postalCode varchar(10),
        country varchar(15),
        homePhone varchar(24),
        extension varchar(4),
        photo varchar(255),
        notes varchar(MAX),
        reportsToId bigint
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET
          firstName = source.firstName,
          lastName = source.lastName,
          title = source.title,
          titleOfCourtesy = source.titleOfCourtesy,
          birthDate = source.birthDate,
          hireDate = source.hireDate,
          address = source.address,
          city = source.city,
          region = source.region,
          postalCode = source.postalCode,
          country = source.country,
          homePhone = source.homePhone,
          extension = source.extension,
          photo = source.photo,
          notes = source.notes,
          reportsTo = source.reportsToId
      WHEN NOT MATCHED THEN
        INSERT (id, firstName, lastName, title, titleOfCourtesy, birthDate, hireDate, address, city, region, postalCode, country, homePhone, extension, photo, notes, reportsTo)
        VALUES (source.id, source.firstName, source.lastName, source.title, source.titleOfCourtesy, source.birthDate, source.hireDate, source.address, source.city, source.region, source.postalCode, source.country, source.homePhone, source.extension, source.photo, source.notes, source.reportsToId);

      ALTER TABLE employee CHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT employee OFF`;
    });
  }
}
