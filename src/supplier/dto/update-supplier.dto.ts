import { PartialType } from '@nestjs/mapped-types';

import { CreateSupplier } from './create-supplier.dto.js';

export class UpdateSupplier extends PartialType(CreateSupplier) {}
