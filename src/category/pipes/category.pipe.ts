import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { Category } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';

@Injectable()
export class CategoryPipe implements PipeTransform {
  constructor(private readonly categoryService: CategoryService) {}

  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      return this.categoryService.findOne(value as Category['id']);
    }

    if (typeof value === 'object' && value !== null && 'category' in value) {
      (value as { category: Category }).category =
        await this.categoryService.findOne(value.category as Category['id']);
    }

    return value;
  }
}
