import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
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
  intercept(
    context: ExecutionContext,
    next: CallHandler<[Item[], number]>,
  ): Observable<Pagination<Item>> {
    const request = context.switchToHttp().getRequest<Request>();
    const itemsPerPage = Math.abs(
      Number.parseInt(request.query.limit as string, 10) || 10,
    );
    const currentPage = Math.abs(
      Number.parseInt(request.query.page as string, 10) || 1,
    );

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
