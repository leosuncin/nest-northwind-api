import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { EmployeeController } from './controllers/employee.controller';
import { Employee } from './entities/employee.entity';
import { EmployeeService } from './services/employee.service';
import { IsExistingEmployeeConstraint } from './validators/is-existing-employee.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), SharedModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, IsExistingEmployeeConstraint],
  exports: [IsExistingEmployeeConstraint],
})
export class EmployeeModule {}
