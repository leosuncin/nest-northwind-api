import { getRepositoryToken } from '@nestjs/typeorm';
import { defineQuery } from '@rapiq/core';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import type { Repository, SelectQueryBuilder } from 'typeorm';

import { CreateEmployee } from '../dto/create-employee.dto.js';
import { UpdateEmployee } from '../dto/update-employee.dto.js';
import { Employee } from '../entities/employee.entity.js';
import { EmployeeService } from './employee.service.js';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repository: Mocked<Repository<Employee>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(EmployeeService).compile();

    service = unit;
    repository = unitRef.get(
      getRepositoryToken(Employee) as string,
    ) as unknown as Mocked<Repository<Employee>>;
  });

  test('given a valid dto when create then it persists and returns the employee', async () => {
    const createEmployee: CreateEmployee = {
      firstName: 'John',
      lastName: 'Doe',
    };
    const createdEmployee = { id: 1, ...createEmployee } as Employee;

    repository.create.mockReturnValue(createdEmployee);
    repository.save.mockResolvedValue(createdEmployee);

    const employee = await service.create(createEmployee);

    expect(employee).toEqual(createdEmployee);
    expect(repository.create).toHaveBeenCalledWith(createEmployee);
    expect(repository.save).toHaveBeenCalledWith(createdEmployee);
  });

  test('given pagination params when findAll then it returns a paginated result', async () => {
    const filters = defineQuery({ pagination: { limit: 5, offset: 5 } });
    const result: [Employee[], number] = [
      [{ id: 1, firstName: 'John', lastName: 'Doe' }],
      1,
    ];

    const queryBuilder = mock<SelectQueryBuilder<Employee>>();
    repository.createQueryBuilder.mockReturnValue(queryBuilder);
    queryBuilder.getManyAndCount.mockResolvedValue(result);

    const employees = await service.findAll(filters);

    expect(employees).toEqual(result);
    expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
  });

  test('given an id when findOne then it returns the matching employee', async () => {
    const id = 1;
    const employee = { id, firstName: 'John', lastName: 'Doe' } as Employee;

    repository.findOneByOrFail.mockResolvedValue(employee);

    const found = await service.findOne(id);

    expect(found).toEqual(employee);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });

  test('given an employee and changes when update then it merges and persists them', async () => {
    const employee = { id: 1, firstName: 'John', lastName: 'Doe' } as Employee;
    const changes: UpdateEmployee = { firstName: 'Jane' };

    repository.merge.mockReturnValue(employee);
    repository.save.mockResolvedValue(employee);

    const result = await service.update(employee, changes);

    expect(result).toEqual(employee);
    expect(repository.merge).toHaveBeenCalledWith(employee, changes);
    expect(repository.save).toHaveBeenCalledWith(employee);
  });

  test('given an employee when remove then it deletes and returns it', async () => {
    const employee = { id: 1, firstName: 'John', lastName: 'Doe' } as Employee;

    repository.remove.mockResolvedValue(employee);

    const result = await service.remove(employee);

    expect(result).toEqual(employee);
    expect(repository.remove).toHaveBeenCalledWith(employee);
  });

  test('given the employee id when the employee exist then it returns true', async () => {
    const id = 1;

    void repository.countBy.mockResolvedValue(1);

    const result = await service.exists(1);

    expect(result).toBe(true);
    expect(repository.countBy).toHaveBeenCalledWith({ id });
  });
});
