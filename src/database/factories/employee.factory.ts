import { setSeederFactory } from 'typeorm-extension';

import { Employee } from '../../employee/entities/employee.entity';
import { roundDateToDay } from '../../shared/utils/date.utils';

export const employeeFactory = setSeederFactory(Employee, (faker) => {
  const employee = new Employee();

  employee.lastName = faker.person.lastName().substring(0, 20);
  employee.firstName = faker.person.firstName().substring(0, 10);
  employee.title = faker.person.jobTitle().substring(0, 30);
  employee.titleOfCourtesy = faker.helpers.arrayElement([
    'Mr.',
    'Ms.',
    'Mrs.',
    'Dr.',
  ]);
  employee.birthDate = roundDateToDay(
    faker.date.birthdate({
      min: 1950,
      max: 2000,
      mode: 'year',
    }),
  );
  employee.hireDate = roundDateToDay(faker.date.past({ years: 10 }));
  employee.address = faker.location.streetAddress().substring(0, 60);
  employee.city = faker.location.city().substring(0, 15);
  employee.region = faker.location.state().substring(0, 15);
  employee.postalCode = faker.location.zipCode().substring(0, 10);
  employee.country = faker.location.country().substring(0, 15);
  employee.homePhone = faker.phone.number({ style: 'human' }).substring(0, 24);
  employee.extension = faker.string.numeric(4);
  employee.notes = faker.lorem.paragraphs(2);
  employee.photo = faker.image.avatar();

  return employee;
});
