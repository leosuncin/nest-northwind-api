import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';

@Injectable()
export class SetIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<
        Request<{ id: string }, unknown, Record<string, unknown> | never>
      >();

    if (typeof request.body === 'object' && request.body !== null) {
      Object.assign(request.body, { id: request.params.id });
    }

    return next.handle();
  }
}
