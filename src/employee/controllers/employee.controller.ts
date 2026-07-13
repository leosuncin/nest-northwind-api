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
import { EmployeeFilter } from '../filters/employee.filter';
import { EmployeePipe } from '../pipes/employee.pipe';
import { Employee } from '../entities/employee.entity';

@Controller('employee')
@UseFilters(EmployeeFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createEmployee: CreateEmployee) {
    return this.employeeService.create(createEmployee);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
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
