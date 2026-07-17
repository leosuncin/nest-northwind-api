import { getRepositoryToken } from '@nestjs/typeorm';
import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import type { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { ProductService } from '../services/product.service';
import { ProductPipe } from './product.pipe';

describe('ProductPipe', () => {
  let pipe: ProductPipe;
  let repository: Mocked<Repository<Product>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.sociable(ProductPipe)
      .expose(ProductService)
      .compile();

    pipe = unit;
    repository = unitRef.get(
      getRepositoryToken(Product) as string,
    ) as unknown as Mocked<Repository<Product>>;
  });

  test('given a product id when transform then it returns the product from the service', async () => {
    const id = 1;
    const product = { id } as Product;

    repository.findOneByOrFail.mockResolvedValue(product);

    const result = await pipe.transform(id);

    expect(result).toEqual(product);
    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id });
  });
});
