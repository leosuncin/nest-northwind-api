import { PartialType } from '@nestjs/mapped-types';

import { CreateOrderDetail } from './create-order-detail.dto';

export class UpdateOrderDetail extends PartialType(CreateOrderDetail) {}
