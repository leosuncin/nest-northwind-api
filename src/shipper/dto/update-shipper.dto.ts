import { PartialType } from '@nestjs/mapped-types';

import { CreateShipper } from './create-shipper.dto';

export class UpdateShipper extends PartialType(CreateShipper) {}
