import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateEmployee } from '../dto/create-employee.dto';
import { UpdateEmployee } from '../dto/update-employee.dto';
import { Employee } from '../entities/employee.entity';

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

  findAll(page = 1, limit = 10) {
    return this.employeeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
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
