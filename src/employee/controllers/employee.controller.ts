import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { IQuery } from '@rapiq/core';

import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter.js';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor.js';
import { CreateEmployee } from '../dto/create-employee.dto.js';
import { UpdateEmployee } from '../dto/update-employee.dto.js';
import { Employee } from '../entities/employee.entity.js';
import { EmployeePipe } from '../pipes/employee.pipe.js';
import { EmployeeService } from '../services/employee.service.js';

@Controller('employee')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createEmployee: CreateEmployee) {
    return this.employeeService.create(createEmployee);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  @SetMetadata('schema', 'employee')
  findAll(@Query() filters: IQuery) {
    return this.employeeService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id', EmployeePipe) employee: Employee,
    @Body() updateEmployee: UpdateEmployee,
  ) {
    return this.employeeService.update(employee, updateEmployee);
  }

  @Delete(':id')
  remove(@Param('id', EmployeePipe) employee: Employee) {
    return this.employeeService.remove(employee);
  }
}
