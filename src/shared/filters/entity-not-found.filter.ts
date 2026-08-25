import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { type BaseEntity, EntityNotFoundError } from 'typeorm';

function toSentenceCase(string: string) {
  return string.replace(/[A-Z]/g, (letter, position) =>
    position === 0 ? letter.toLowerCase() : ' ' + letter.toLowerCase(),
  );
}

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter<
  E extends BaseEntity,
> implements ExceptionFilter<EntityNotFoundError> {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const entityName = (exception.entityClass as new () => E).name;
    const id = new URLSearchParams(request.params as Record<string, string>)
      .toString()
      .replace(/([=&])/g, (match, ...matches: [string, number, string]) =>
        match === '='
          ? ': '
          : matches[1] === matches[2].lastIndexOf('&')
            ? ' and '
            : ', ',
      );

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: `${entityName} not found`,
      why: `The ${toSentenceCase(entityName)} with ${id} does not exist`,
    });
  }
}
