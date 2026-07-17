import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { EmployeeService } from '../services/employee.service';
import { CreateEmployee } from '../dto/create-employee.dto';
import { UpdateEmployee } from '../dto/update-employee.dto';
import { EmployeePipe } from '../pipes/employee.pipe';
import { Employee } from '../entities/employee.entity';
import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor';
import { PositiveIntPipe } from '../../shared/pipes/positive-int.pipe';

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
  findAll(
    @Query('page', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    page = 1,
    @Query('limit', new ParseIntPipe({ optional: true }), PositiveIntPipe)
    limit = 10,
  ) {
    return this.employeeService.findAll(page, limit);
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
