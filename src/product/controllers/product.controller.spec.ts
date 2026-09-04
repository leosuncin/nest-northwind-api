import type { IQuery } from '@rapiq/core';
import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';

import { Category } from '../../category/entities/category.entity.js';
import { Supplier } from '../../supplier/entities/supplier.entity.js';
import { CreateProduct } from '../dto/create-product.dto.js';
import { UpdateProduct } from '../dto/update-product.dto.js';
import { Product } from '../entities/product.entity.js';
import { ProductService } from '../services/product.service.js';
import { ProductController } from './product.controller.js';

describe('ProductController', () => {
  let controller: ProductController;
  let service: Mocked<ProductService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(ProductController).compile();

    controller = unit;
    service = unitRef.get(ProductService) as unknown as Mocked<ProductService>;
  });

  test('given a valid dto when create then it delegates to the service', async () => {
    const createProduct: CreateProduct = { name: 'Chai' };
    const createdProduct = { id: 1, ...createProduct } as Product;

    service.create.mockResolvedValue(createdProduct);

    const result = await controller.create(createProduct);

    expect(result).toEqual(createdProduct);
    expect(service.create).toHaveBeenCalledWith(createProduct);
  });

  test('given filters when findAll then it delegates to the service', async () => {
    const filters = {
      pagination: {
        limit: 5,
        offset: 5,
      },
    } as IQuery;
    const products: [Product[], number] = [
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

    service.findAll.mockResolvedValue(products);

    const result = await controller.findAll(filters);

    expect(result).toEqual(products);
    expect(service.findAll).toHaveBeenCalledWith(filters);
  });

  test('given an id when findOne then it delegates to the service', async () => {
    const id = 1;
    const product = { id, name: 'Chai' } as Product;

    service.findOne.mockResolvedValue(product);

    const result = await controller.findOne(id);

    expect(result).toEqual(product);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  test('given a product and changes when update then it delegates to the service', async () => {
    const product = { id: 1, name: 'Chai' } as Product;
    const changes: UpdateProduct = { name: 'Updated Chai' };
    const updatedProduct = { ...product, ...changes };

    service.update.mockResolvedValue(updatedProduct);

    const result = await controller.update(product, changes);

    expect(result).toEqual(updatedProduct);
    expect(service.update).toHaveBeenCalledWith(product, changes);
  });

  test('given a product when remove then it delegates to the service', async () => {
    const product = { id: 1, name: 'Chai' } as Product;

    service.remove.mockResolvedValue(product);

    const result = await controller.remove(product);

    expect(result).toEqual(product);
    expect(service.remove).toHaveBeenCalledWith(product);
  });
});
