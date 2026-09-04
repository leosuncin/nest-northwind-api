import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeormAdapter } from '@rapiq/adapter-typeorm';
import type { IQuery } from '@rapiq/core';
import type { Repository } from 'typeorm';

import { CreateShipper } from '../dto/create-shipper.dto.js';
import { UpdateShipper } from '../dto/update-shipper.dto.js';
import { Shipper } from '../entities/shipper.entity.js';

@Injectable()
export class ShipperService {
  constructor(
    @InjectRepository(Shipper)
    private readonly shipperRepository: Repository<Shipper>,
  ) {}

  create(createShipper: CreateShipper) {
    const shipper = this.shipperRepository.create(createShipper);

    return this.shipperRepository.save(shipper);
  }

  findAll(filters: IQuery) {
    const queryBuilder = this.shipperRepository.createQueryBuilder('shipper');
    const adapter = new TypeormAdapter({ queryBuilder });
    adapter.execute(filters);

    return queryBuilder.getManyAndCount();
  }

  findOne(id: number) {
    return this.shipperRepository.findOneByOrFail({ id });
  }

  update(shipper: Shipper, updateShipper: UpdateShipper) {
    this.shipperRepository.merge(shipper, updateShipper);

    return this.shipperRepository.save(shipper);
  }

  remove(shipper: Shipper) {
    return this.shipperRepository.remove(shipper);
  }

  async exists(id: Shipper['id']) {
    const count = await this.shipperRepository.countBy({ id });

    return count > 0;
  }
}
