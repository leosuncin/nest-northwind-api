import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';

import type { Supplier } from '../entities/supplier.entity.js';
import { SupplierService } from '../services/supplier.service.js';

@Injectable()
export class SupplierPipe implements PipeTransform {
  constructor(private readonly supplierService: SupplierService) {}

  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      return this.supplierService.findOne(value as Supplier['id']);
    }

    if (typeof value === 'object' && value !== null && 'supplier' in value) {
      (value as { supplier: Supplier }).supplier =
        await this.supplierService.findOne(value.supplier as Supplier['id']);
    }

    return value;
  }
}
