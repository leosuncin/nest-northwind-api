import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module.js';
import { ShipperController } from './controllers/shipper.controller.js';
import { Shipper } from './entities/shipper.entity.js';
import { ShipperService } from './services/shipper.service.js';
import { IsExistingShipperConstraint } from './validators/is-existing-shipper.validator.js';

@Module({
  imports: [TypeOrmModule.forFeature([Shipper]), SharedModule.forFeature()],
  controllers: [ShipperController],
  providers: [ShipperService, IsExistingShipperConstraint],
  exports: [IsExistingShipperConstraint],
})
export class ShipperModule {}
