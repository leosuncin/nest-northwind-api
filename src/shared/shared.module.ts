import { Module } from '@nestjs/common';

import { PaginationInterceptor } from './interceptors/pagination.interceptor';
import { EntityNotFoundFilter } from './filters/entity-not-found.filter';

@Module({
  providers: [PaginationInterceptor, EntityNotFoundFilter],
  exports: [PaginationInterceptor, EntityNotFoundFilter],
})
export class SharedModule {}
