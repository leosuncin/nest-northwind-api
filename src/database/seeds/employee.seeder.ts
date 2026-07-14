import { Seeder } from 'typeorm-extension';

import { Employee } from '../../employee/entities/employee.entity';
import { DataSource } from 'typeorm';

export const AndrewFuller = Object.assign(new Employee(), {
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
});

export const NancyDavolio = Object.assign(new Employee(), {
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
});

export const JanetLeverling = Object.assign(new Employee(), {
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
});

export const MargaretPeacock = Object.assign(new Employee(), {
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
});

export const StevenBuchanan = Object.assign(new Employee(), {
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
});

export const MichaelSuyama = Object.assign(new Employee(), {
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
});

export const RobertKing = Object.assign(new Employee(), {
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
});

export const LauraCallahan = Object.assign(new Employee(), {
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
});

export const AnneDodsworth = Object.assign(new Employee(), {
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
});

export default class EmployeeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Employee);

    await repository.save([
      AndrewFuller,
      NancyDavolio,
      JanetLeverling,
      MargaretPeacock,
      StevenBuchanan,
      MichaelSuyama,
      RobertKing,
      LauraCallahan,
      AnneDodsworth,
    ]);
  }
}
