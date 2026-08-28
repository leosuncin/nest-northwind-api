import { Injectable, PipeTransform } from '@nestjs/common';

import { Product } from '../entities/product.entity.js';
import { ProductService } from '../services/product.service.js';

@Injectable()
export class ProductPipe implements PipeTransform {
  constructor(private readonly productService: ProductService) {}

  transform(value: Product['id']) {
    return this.productService.findOne(value);
  }
}
