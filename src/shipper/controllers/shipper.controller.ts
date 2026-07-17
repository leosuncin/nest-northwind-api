import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { ShipperService } from '../services/shipper.service';
import { CreateShipper } from '../dto/create-shipper.dto';
import { UpdateShipper } from '../dto/update-shipper.dto';
import { Shipper } from '../entities/shipper.entity';
import { ShipperPipe } from '../pipes/shipper.pipe';
import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter';
import { PaginationInterceptor } from '../../shared/interceptors/pagination.interceptor';

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
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.shipperService.findAll(page, limit);
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
