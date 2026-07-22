import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { ShipperController } from './controllers/shipper.controller';
import { Shipper } from './entities/shipper.entity';
import { ShipperService } from './services/shipper.service';
import { IsExistingShipperConstraint } from './validators/is-existing-shipper.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Shipper]), SharedModule],
  controllers: [ShipperController],
  providers: [ShipperService, IsExistingShipperConstraint],
  exports: [IsExistingShipperConstraint],
})
export class ShipperModule {}
