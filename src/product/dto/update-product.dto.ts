import { PartialType } from '@nestjs/mapped-types';

import { CreateProduct } from './create-product.dto.js';

export class UpdateProduct extends PartialType(CreateProduct) {}
