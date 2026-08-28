import { Test } from '@nestjs/testing';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { plainToInstance } from 'class-transformer';
import { useContainer, validate } from 'class-validator';

import {
  IsExistingEmployee,
  IsExistingEmployeeConstraint,
} from './is-existing-employee.validator.js';
import { EmployeeService } from '../services/employee.service.js';

describe('IsExistingEmployee validator', () => {
  class TestDto {
    @IsExistingEmployee()
    readonly employeeId!: number;
  }

  let service: Mocked<EmployeeService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: EmployeeService,
          useFactory: mock,
        },
        IsExistingEmployeeConstraint,
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });

    service = module.get<Mocked<EmployeeService>>(EmployeeService);
  });

  it('given a DTO when the employee id exists then it should not be any errors', async () => {
    void service.exists.mockResolvedValue(true);

    const dto = plainToInstance(TestDto, { employeeId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('given a DTO when the employee id does not exist then it should return an error', async () => {
    void service.exists.mockResolvedValue(false);

    const dto = plainToInstance(TestDto, { employeeId: 1 });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchInlineSnapshot(`
      {
        "IsExistingEmployee": "Employee with id 1 does not exist",
      }
    `);
  });
});
