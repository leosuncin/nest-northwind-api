import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { type BaseEntity, EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter<
  E extends BaseEntity,
> implements ExceptionFilter<EntityNotFoundError> {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const entityName = (exception.entityClass as new () => E).name;
    const id = Array.isArray(request.params['id'])
      ? request.params['id'][0]
      : request.params['id'];

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: `${entityName} not found`,
      why: `The ${entityName.toLowerCase()} with id: ${id} does not exist`,
    });
  }
}
