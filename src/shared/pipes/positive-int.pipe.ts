import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform<number> {
  transform(value: number) {
    if (value < 1) {
      throw new BadRequestException('Value must be a positive integer');
    }

    return value;
  }
}
