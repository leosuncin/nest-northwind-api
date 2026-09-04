import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeormAdapter } from '@rapiq/adapter-typeorm';
import type { IQuery } from '@rapiq/core';
import type { Repository } from 'typeorm';

import { CreateEmployee } from '../dto/create-employee.dto.js';
import { UpdateEmployee } from '../dto/update-employee.dto.js';
import { Employee } from '../entities/employee.entity.js';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  create(createEmployee: CreateEmployee) {
    const employee = this.employeeRepository.create(createEmployee);

    return this.employeeRepository.save(employee);
  }

  findAll(filters: IQuery) {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');
    const adapter = new TypeormAdapter({
      queryBuilder,
      relations: { joinAndSelect: true },
    });
    adapter.execute(filters);

    return queryBuilder.getManyAndCount();
  }

  findOne(id: number) {
    return this.employeeRepository.findOneByOrFail({ id });
  }

  update(employee: Employee, updateEmployee: UpdateEmployee) {
    this.employeeRepository.merge(employee, updateEmployee);

    return this.employeeRepository.save(employee);
  }

  remove(employee: Employee) {
    return this.employeeRepository.remove(employee);
  }

  async exists(id: Employee['id']) {
    const count = await this.employeeRepository.countBy({ id });

    return count > 0;
  }
}
