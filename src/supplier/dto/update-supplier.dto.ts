import { PartialType } from '@nestjs/mapped-types';

import { CreateSupplier } from './create-supplier.dto';

export class UpdateSupplier extends PartialType(CreateSupplier) {}
