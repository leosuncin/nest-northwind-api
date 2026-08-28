import { Injectable, PipeTransform } from '@nestjs/common';

import { Shipper } from '../entities/shipper.entity.js';
import { ShipperService } from '../services/shipper.service.js';

@Injectable()
export class ShipperPipe implements PipeTransform {
  constructor(private readonly shipperService: ShipperService) {}

  transform(value: Shipper['id']) {
    return this.shipperService.findOne(value);
  }
}
