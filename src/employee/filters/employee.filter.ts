import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import type { Response, Request } from 'express';

@Catch(EntityNotFoundError)
export class EmployeeFilter implements ExceptionFilter<EntityNotFoundError> {
  catch(_exception: EntityNotFoundError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: `Employee not found`,
      why: `The employee with id: ${request.params['id'] as string} does not exist`,
    });
  }
}
