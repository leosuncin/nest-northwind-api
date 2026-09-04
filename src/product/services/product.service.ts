import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeormAdapter } from '@rapiq/adapter-typeorm';
import type { IQuery } from '@rapiq/core';
import type { Repository } from 'typeorm';

import { CreateProduct } from '../dto/create-product.dto.js';
import { UpdateProduct } from '../dto/update-product.dto.js';
import { Product } from '../entities/product.entity.js';

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

  findAll(filters: IQuery) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    const adapter = new TypeormAdapter({
      queryBuilder,
      relations: { joinAndSelect: true },
    });

    adapter.execute(filters);

    return queryBuilder.getManyAndCount();
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

  async exists(id: Product['id']) {
    const count = await this.productRepository.countBy({ id });

    return count > 0;
  }
}
