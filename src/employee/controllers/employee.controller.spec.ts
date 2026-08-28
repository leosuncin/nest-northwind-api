import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';

import { EmployeeController } from './employee.controller.js';
import { EmployeeService } from '../services/employee.service.js';
import { CreateEmployee } from '../dto/create-employee.dto.js';
import { UpdateEmployee } from '../dto/update-employee.dto.js';
import { Employee } from '../entities/employee.entity.js';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: Mocked<EmployeeService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(EmployeeController).compile();

    controller = unit;
    service = unitRef.get(
      EmployeeService,
    ) as unknown as Mocked<EmployeeService>;
  });

  test('given a valid dto when create then it delegates to the service', async () => {
    const createEmployee: CreateEmployee = {
      firstName: 'John',
      lastName: 'Doe',
    };
    const createdEmployee = { id: 1, ...createEmployee } as Employee;

    service.create.mockResolvedValue(createdEmployee);

    const result = await controller.create(createEmployee);

    expect(result).toEqual(createdEmployee);
    expect(service.create).toHaveBeenCalledWith(createEmployee);
  });

  test('given a page and limit when findAll then it delegates to the service', async () => {
    const page = 2;
    const limit = 5;
    const employees: [Employee[], number] = [
      [{ id: 1, firstName: 'John', lastName: 'Doe' }],
      1,
    ];

    service.findAll.mockResolvedValue(employees);

    const result = await controller.findAll(page, limit);

    expect(result).toEqual(employees);
    expect(service.findAll).toHaveBeenCalledWith(page, limit);
  });

  test('given an id when findOne then it delegates to the service', async () => {
    const id = 1;
    const employee = { id, firstName: 'John', lastName: 'Doe' } as Employee;

    service.findOne.mockResolvedValue(employee);

    const result = await controller.findOne(id);

    expect(result).toEqual(employee);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  test('given an employee and changes when update then it delegates to the service', async () => {
    const employee = { id: 1, firstName: 'John', lastName: 'Doe' } as Employee;
    const changes: UpdateEmployee = { firstName: 'Jane' };
    const updatedEmployee = { ...employee, ...changes };

    service.update.mockResolvedValue(updatedEmployee);

    const result = await controller.update(employee, changes);

    expect(result).toEqual(updatedEmployee);
    expect(service.update).toHaveBeenCalledWith(employee, changes);
  });

  test('given an employee when remove then it delegates to the service', async () => {
    const employee = { id: 1, firstName: 'John', lastName: 'Doe' } as Employee;

    service.remove.mockResolvedValue(employee);

    const result = await controller.remove(employee);

    expect(result).toEqual(employee);
    expect(service.remove).toHaveBeenCalledWith(employee);
  });
});
