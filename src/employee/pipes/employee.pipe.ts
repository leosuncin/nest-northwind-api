import { Injectable, PipeTransform } from '@nestjs/common';

import { Employee } from '../entities/employee.entity';
import { EmployeeService } from '../services/employee.service';

@Injectable()
export class EmployeePipe implements PipeTransform {
  constructor(private readonly employeeService: EmployeeService) {}

  transform(value: Employee['id']) {
    return this.employeeService.findOne(value);
  }
}
