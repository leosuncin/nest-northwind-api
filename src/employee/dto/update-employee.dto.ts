import { PartialType } from '@nestjs/mapped-types';

import { CreateEmployee } from './create-employee.dto.js';

export class UpdateEmployee extends PartialType(CreateEmployee) {}
