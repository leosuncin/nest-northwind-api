import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateProduct } from '../dto/create-product.dto';
import { UpdateProduct } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(createProduct: CreateProduct) {
    const product = this.productRepository.create(createProduct);

    return this.productRepository.save(product);
  }

  findAll(page = 1, limit = 10) {
    return this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.productRepository.findOneOrFail({
      where: { id },
      relations: { category: true, supplier: true },
    });
  }

  update(product: Product, updateProduct: UpdateProduct) {
    this.productRepository.merge(product, updateProduct);

    return this.productRepository.save(product);
  }

  remove(product: Product) {
    return this.productRepository.remove(product);
  }
}
