import { Injectable, PipeTransform } from '@nestjs/common';

import { Supplier } from '../entities/supplier.entity';
import { SupplierService } from '../services/supplier.service';

@Injectable()
export class SupplierPipe implements PipeTransform {
  constructor(private readonly supplierService: SupplierService) {}

  transform(value: Supplier['id']) {
    return this.supplierService.findOne(value);
  }
}
