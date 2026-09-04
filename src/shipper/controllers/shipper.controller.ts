import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { IQuery } from '@rapiq/core';

import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter.js';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor.js';
import { CreateShipper } from '../dto/create-shipper.dto.js';
import { UpdateShipper } from '../dto/update-shipper.dto.js';
import { Shipper } from '../entities/shipper.entity.js';
import { ShipperPipe } from '../pipes/shipper.pipe.js';
import { ShipperService } from '../services/shipper.service.js';

@Controller('shipper')
@UseFilters(EntityNotFoundFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createShipper: CreateShipper) {
    return this.shipperService.create(createShipper);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  @SetMetadata('schema', 'shipper')
  findAll(@Query() filters: IQuery) {
    return this.shipperService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shipperService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id', ParseIntPipe, ShipperPipe) shipper: Shipper,
    @Body() updateShipper: UpdateShipper,
  ) {
    return this.shipperService.update(shipper, updateShipper);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe, ShipperPipe) shipper: Shipper) {
    return this.shipperService.remove(shipper);
  }
}
