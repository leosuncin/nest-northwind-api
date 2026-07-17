import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShipperService } from './services/shipper.service';
import { ShipperController } from './controllers/shipper.controller';
import { Shipper } from './entities/shipper.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Shipper]), SharedModule],
  controllers: [ShipperController],
  providers: [ShipperService],
})
export class ShipperModule {}
