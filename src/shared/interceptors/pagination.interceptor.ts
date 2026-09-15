import {
  BadRequestException,
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createURLCodec, formatErrors } from '@rapiq/codec-url';
import { isBaseError, isParseError, SchemaRegistry } from '@rapiq/core';
import type { Request } from 'express';
import { map, type Observable } from 'rxjs';

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
    const schema = this.reflector.getAllAndOverride<string>('schema', [
      context.getHandler(),
      context.getClass(),
    ]);
    const codec = createURLCodec(this.registry);

    try {
      const query = codec.decode(request.url, { schema })!;

      Object.defineProperty(request, 'query', {
        value: query,
      });
    } catch (error) {
      if (isBaseError(error) || isParseError(error)) {
        throw new BadRequestException({
          errors: formatErrors(error.issues),
          message: 'Failed to parse the filters',
          why: error.message,
        });
      }

      throw error;
    }

    // @ts-expect-error pagination
    const itemsPerPage = request.query.pagination?.limit ?? 100;
    const currentPage =
      // @ts-expect-error pagination
      Number.isInteger(request.query.pagination?.offset) &&
      // @ts-expect-error pagination
      request.query.pagination?.offset > 0
        ? // @ts-expect-error pagination
          Math.floor(request.query.pagination.offset / itemsPerPage) + 1
        : 1;

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
