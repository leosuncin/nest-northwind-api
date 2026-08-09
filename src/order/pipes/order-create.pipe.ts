import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';

@Injectable()
export class OrderCreatePipe implements PipeTransform {
  transform(value: Record<string, unknown>, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const transformed = structuredClone(value);

    if (typeof transformed.customer === 'number') {
      transformed.customer = { id: transformed.customer };
    }

    if (typeof transformed.employee === 'number') {
      transformed.employee = { id: transformed.employee };
    }

    if ('shipVia' in transformed && typeof transformed.shipVia === 'number') {
      transformed.shipVia = { id: transformed.shipVia };
    }

    if (Array.isArray(transformed.details)) {
      transformed.details = transformed.details.map(
        (detail: Record<string, unknown>) => ({
          ...detail,
          product:
            typeof detail.product === 'number'
              ? { id: detail.product }
              : detail.product,
        }),
      );
    }

    return transformed;
  }
}
