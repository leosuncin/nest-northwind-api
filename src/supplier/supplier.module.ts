import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { SupplierController } from './controllers/supplier.controller';
import { Supplier } from './entities/supplier.entity';
import { SupplierService } from './services/supplier.service';
import { IsExistingSupplierConstraint } from './validators/is-existing-supplier.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier]), SharedModule],
  controllers: [SupplierController],
  providers: [SupplierService, IsExistingSupplierConstraint],
  exports: [SupplierService, IsExistingSupplierConstraint],
})
export class SupplierModule {}
