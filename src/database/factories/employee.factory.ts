import { setSeederFactory } from 'typeorm-extension';

import { Employee } from '../../employee/entities/employee.entity';

export const employeeFactory = setSeederFactory(Employee, (faker) => {
  const employee = new Employee();

  employee.lastName = faker.person.lastName();
  employee.firstName = faker.person.firstName();
  employee.title = faker.person.jobTitle();
  employee.titleOfCourtesy = faker.helpers.arrayElement([
    'Mr.',
    'Ms.',
    'Mrs.',
    'Dr.',
  ]);
  employee.birthDate = faker.date.birthdate({
    min: 1950,
    max: 2000,
    mode: 'year',
  });
  employee.hireDate = faker.date.past({ years: 10 });
  employee.address = faker.location.streetAddress();
  employee.city = faker.location.city();
  employee.region = faker.location.state();
  employee.postalCode = faker.location.zipCode();
  employee.country = faker.location.country();
  employee.homePhone = faker.phone.number({ style: 'human' });
  employee.extension = faker.string.numeric(4);
  employee.notes = faker.lorem.paragraphs(2);
  employee.photo = faker.image.avatar();

  return employee;
});
