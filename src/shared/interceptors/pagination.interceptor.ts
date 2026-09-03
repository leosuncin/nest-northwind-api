import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createURLCodec } from '@rapiq/codec-url';
import { isPagination, isQuery, SchemaRegistry } from '@rapiq/core';
import type { Request } from 'express';
import { map, Observable } from 'rxjs';

export interface Pagination<I> {
  items: I[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable()
export class PaginationInterceptor<
  Item = Record<string, unknown>,
> implements NestInterceptor<[Item[], number], Pagination<Item>> {
  constructor(
    private readonly registry: SchemaRegistry,
    private readonly reflector: Reflector,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<[Item[], number]>,
  ): Observable<Pagination<Item>> {
    const request = context.switchToHttp().getRequest<Request>();
    const schema =
      this.reflector.getAllAndOverride<string>('schema', [
        context.getHandler(),
        context.getClass(),
      ]) ?? request.path.split('/')[1];
    let limit: number, offset: number, page: number;

    if (this.registry.get(schema)) {
      const codec = createURLCodec(this.registry);
      const query = codec.decode(request.url, { schema });

      Object.defineProperty(request, 'query', {
        value: query,
      });

      limit = query?.pagination.limit ?? 100;
      offset = query?.pagination.offset ?? 0;
      page = Math.floor(+offset / +limit) + 1;
    } else {
      limit = Number.parseInt(request.query.limit as string, 10) || 100;
      page = Number.parseInt(request.query.page as string, 10) || 1;
      offset = Math.floor(page / limit) + 1;
    }

    const itemsPerPage = limit;
    const currentPage = page;

    if (!isPagination(request.query.pagination)) {
      // @ts-expect-error set pagination
      request.query.pagination = { limit, offset };
    }

    return next.handle().pipe(
      map(([items, totalItems]) => ({
        items,
        meta: {
          itemCount: items.length,
          totalItems,
          itemsPerPage,
          totalPages: Math.ceil(totalItems / itemsPerPage),
          currentPage,
          hasNextPage: currentPage * itemsPerPage < totalItems,
          hasPreviousPage: currentPage > 1,
        },
      })),
    );
  }
}
