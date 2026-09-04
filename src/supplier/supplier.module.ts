import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module.js';
import { SupplierController } from './controllers/supplier.controller.js';
import { Supplier } from './entities/supplier.entity.js';
import { SupplierService } from './services/supplier.service.js';
import { IsExistingSupplierConstraint } from './validators/is-existing-supplier.validator.js';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier]), SharedModule.forFeature()],
  controllers: [SupplierController],
  providers: [SupplierService, IsExistingSupplierConstraint],
  exports: [SupplierService, IsExistingSupplierConstraint],
})
export class SupplierModule {}
