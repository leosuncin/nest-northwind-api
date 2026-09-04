import { getRepositoryToken } from '@nestjs/typeorm';
import { defineQuery } from '@rapiq/core';
import { mock, type Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import type { Repository, SelectQueryBuilder } from 'typeorm';

import { Category } from '../../category/entities/category.entity.js';
import { Supplier } from '../../supplier/entities/supplier.entity.js';
import { CreateProduct } from '../dto/create-product.dto.js';
import { UpdateProduct } from '../dto/update-product.dto.js';
import { Product } from '../entities/product.entity.js';
import { ProductService } from './product.service.js';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Mocked<Repository<Product>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(ProductService).compile();

    service = unit;
    repository = unitRef.get(
      getRepositoryToken(Product) as string,
    ) as unknown as Mocked<Repository<Product>>;
  });

  test('given a valid dto when create then it creates and saves in order', async () => {
    const createProduct: CreateProduct = { name: 'Chai' };
    const createdProduct = { id: 1, ...createProduct } as Product;

    repository.create.mockReturnValue(createdProduct);
    repository.save.mockResolvedValue(createdProduct);

    const product = await service.create(createProduct);

    expect(product).toEqual(createdProduct);
    expect(repository.create).toHaveBeenCalledWith(createProduct);
    expect(repository.save).toHaveBeenCalledWith(createdProduct);
    expect(repository.create.mock.invocationCallOrder[0]).toBeLessThan(
      repository.save.mock.invocationCallOrder[0],
    );
  });

  test('given pagination params when findAll then it returns a paginated result', async () => {
    const filters = defineQuery({ pagination: { limit: 5, offset: 5 } });
    const result: [Product[], number] = [
      [
        {
          id: 1,
          name: 'Chai',
          discontinued: false,
          supplier: new Supplier(),
          category: new Category(),
          unitPrice: 0,
          unitsInStock: 0,
          unitsOnOrder: 0,
          reorderLevel: 0,
        },
      ],
      1,
    ];

    const queryBuilder = mock<SelectQueryBuilder<Product>>();
    repository.createQueryBuilder.mockReturnValue(queryBuilder);
    queryBuilder.getManyAndCount.mockResolvedValue(result);

    const products = await service.findAll(filters);

    expect(products).toEqual(result);
    expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
  });

  test('given an id when findOne then it returns the matching product', async () => {
    const id = 1;
    const product = { id, name: 'Chai' } as Product;

    repository.findOneOrFail.mockResolvedValue(product);

    const found = await service.findOne(id);

    expect(found).toEqual(product);
    expect(repository.findOneOrFail).toHaveBeenCalledWith({
      where: { id },
      relations: { category: true, supplier: true },
    });
  });

  test('given a product and changes when update then it merges and saves in order', async () => {
    const product = { id: 1, name: 'Chai' } as Product;
    const changes: UpdateProduct = { name: 'Updated Chai' };

    repository.merge.mockReturnValue(product);
    repository.save.mockResolvedValue(product);

    const result = await service.update(product, changes);

    expect(result).toEqual(product);
    expect(repository.merge).toHaveBeenCalledWith(product, changes);
    expect(repository.save).toHaveBeenCalledWith(product);
    expect(repository.merge.mock.invocationCallOrder[0]).toBeLessThan(
      repository.save.mock.invocationCallOrder[0],
    );
  });

  test('given a product when remove then it removes and returns it', async () => {
    const product = { id: 1, name: 'Chai' } as Product;

    repository.remove.mockResolvedValue(product);

    const result = await service.remove(product);

    expect(result).toEqual(product);
    expect(repository.remove).toHaveBeenCalledWith(product);
  });

  test('given the product id when the product exist then it returns true', async () => {
    const id = 1;

    void repository.countBy.mockResolvedValue(1);

    const result = await service.exists(1);

    expect(result).toBe(true);
    expect(repository.countBy).toHaveBeenCalledWith({ id });
  });
});
