import { Module } from '@nestjs/common';

import { PaginationInterceptor } from './interceptors/pagination.interceptor';
import { EntityNotFoundFilter } from './filters/entity-not-found.filter';
import { PositiveIntPipe } from './pipes/positive-int.pipe';

@Module({
  providers: [PaginationInterceptor, EntityNotFoundFilter, PositiveIntPipe],
  exports: [PaginationInterceptor, EntityNotFoundFilter, PositiveIntPipe],
})
export class SharedModule {}
