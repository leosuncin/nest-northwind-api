import { Module } from '@nestjs/common';

import { PaginationInterceptor } from './interceptors/pagination.interceptor.js';
import { EntityNotFoundFilter } from './filters/entity-not-found.filter.js';
import { PositiveIntPipe } from './pipes/positive-int.pipe.js';

@Module({
  providers: [PaginationInterceptor, EntityNotFoundFilter, PositiveIntPipe],
  exports: [PaginationInterceptor, EntityNotFoundFilter, PositiveIntPipe],
})
export class SharedModule {}
