import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateSupplier } from '../dto/create-supplier.dto';
import { UpdateSupplier } from '../dto/update-supplier.dto';
import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  create(createSupplier: CreateSupplier) {
    const supplier = this.supplierRepository.create(createSupplier);

    return this.supplierRepository.save(supplier);
  }

  findAll(page = 1, limit = 10) {
    return this.supplierRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.supplierRepository.findOneByOrFail({ id });
  }

  update(supplier: Supplier, updateSupplier: UpdateSupplier) {
    this.supplierRepository.merge(supplier, updateSupplier);

    return this.supplierRepository.save(supplier);
  }

  remove(supplier: Supplier) {
    return this.supplierRepository.remove(supplier);
  }

  async exists(id: Supplier['id']) {
    const count = await this.supplierRepository.countBy({ id });

    return count > 0;
  }
}
