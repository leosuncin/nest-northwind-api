import { getRepositoryToken } from '@nestjs/typeorm';
import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import type { Repository } from 'typeorm';

import { Employee } from '../entities/employee.entity';
import { EmployeeService } from '../services/employee.service';
import { EmployeePipe } from './employee.pipe';

describe('EmployeePipe', () => {
  let pipe: EmployeePipe;
  let repository: Mocked<Repository<Employee>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.sociable(EmployeePipe)
      .expose(EmployeeService)
      .compile();

    pipe = unit;
    repository = unitRef.get(
      getRepositoryToken(Employee) as string,
    ) as unknown as Mocked<Repository<Employee>>;
  });

  test('given an employee id when transform then it returns the employee from the service', async () => {
    const id = 1;
    const employee = { id } as Employee;

    repository.findOneByOrFail.mockResolvedValue(employee);

    const result = await pipe.transform(id);

    expect(result).toEqual(employee);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });
});
