import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeormAdapter } from '@rapiq/adapter-typeorm';
import type { IQuery } from '@rapiq/core';
import type { Repository } from 'typeorm';

import { CreateSupplier } from '../dto/create-supplier.dto.js';
import { UpdateSupplier } from '../dto/update-supplier.dto.js';
import { Supplier } from '../entities/supplier.entity.js';

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

  findAll(filters: IQuery) {
    const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');
    const adapter = new TypeormAdapter({ queryBuilder });
    adapter.execute(filters);

    return queryBuilder.getManyAndCount();
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
