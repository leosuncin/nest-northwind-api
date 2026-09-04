import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module.js';
import { EmployeeController } from './controllers/employee.controller.js';
import { Employee } from './entities/employee.entity.js';
import { EmployeeService } from './services/employee.service.js';
import { IsExistingEmployeeConstraint } from './validators/is-existing-employee.validator.js';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), SharedModule.forFeature()],
  controllers: [EmployeeController],
  providers: [EmployeeService, IsExistingEmployeeConstraint],
  exports: [IsExistingEmployeeConstraint],
})
export class EmployeeModule {}
