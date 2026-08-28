import { PartialType } from '@nestjs/mapped-types';

import { CreateShipper } from './create-shipper.dto.js';

export class UpdateShipper extends PartialType(CreateShipper) {}
