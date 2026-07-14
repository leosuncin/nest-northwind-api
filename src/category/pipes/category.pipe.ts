import { Injectable, PipeTransform } from '@nestjs/common';

import { Category } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';

@Injectable()
export class CategoryPipe implements PipeTransform {
  constructor(private readonly categoryService: CategoryService) {}

  transform(value: Category['id']) {
    return this.categoryService.findOne(value);
  }
}
